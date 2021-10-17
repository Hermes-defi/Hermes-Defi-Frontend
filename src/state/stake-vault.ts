import { useMutation, useQueries, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useStakePoolContract, useUniPair, useVaultContract } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { VaultStakeInfo, vaultStakingPools } from "config/vault-stake";
import { vaults } from "config/vaults";
import { BigNumber, utils } from "ethers";
import { approveLpContract } from "web3-functions";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";

function useFetchVaultStakingPoolRequest() {
  const getLpContract = useERC20();
  const getVaultContract = useVaultContract();
  const getPairContract = useUniPair();
  const getStakePoolContract = useStakePoolContract();
  const currentBlock = useCurrentBlockNumber();
  const { account, library } = useActiveWeb3React();

  return async (stakePoolInfo: VaultStakeInfo) => {
    try {
      const poolChef = getStakePoolContract(stakePoolInfo.address);
      const endBlock = await poolChef.bonusEndBlock();

      stakePoolInfo.rewardEndBlock = endBlock.toString();
      stakePoolInfo.active = stakePoolInfo.active ? endBlock.sub(currentBlock || 0).gt(0) : false;

      const totalStaked = (await poolChef.totalStakeTokenBalance()).toString();

      stakePoolInfo.totalStaked = utils.formatUnits(totalStaked, stakePoolInfo.stakeToken.decimals);

      // get prices
      stakePoolInfo.rewardToken.price = await fetchPrice(stakePoolInfo.rewardToken, library);

      // calculate APR
      if (stakePoolInfo.active) {
        const rewardPerBlock = utils.formatUnits(await poolChef.rewardPerBlock(), stakePoolInfo.rewardToken.decimals);
        const rewardYearly = new BigNumberJS(rewardPerBlock).times(3600).times(24).times(365);
        const rewardYearlyUsd = rewardYearly.times(stakePoolInfo.rewardToken.price);

        // get vault details
        const poolVault = vaults.find((v) => v.address === stakePoolInfo.vaultAddress);
        const poolVaultContract = getVaultContract(poolVault.address);

        const pricePerShare = utils.formatUnits(await poolVaultContract.getPricePerFullShare(), 18);
        const lpContract = getPairContract(poolVault.stakeToken.address);
        const vaultTotalSupply = utils.formatUnits(await lpContract.totalSupply(), poolVault.stakeToken.decimals);
        const depositTokenPrice = await fetchPairPrice(
          poolVault.pairs[0],
          poolVault.pairs[1],
          vaultTotalSupply,
          library,
          poolVault.amm
        );

        const depositTokenStaked = new BigNumberJS(stakePoolInfo.totalStaked);
        let depositTokenStakedUsd = depositTokenStaked.times(depositTokenPrice).times(pricePerShare);

        const apr = rewardYearlyUsd.dividedBy(depositTokenStakedUsd).toNumber();
        stakePoolInfo.apr = {
          yearlyAPR: apr * 100,
          weeklyAPR: 0,
          dailyAPR: 0,
        };
        // console.log({
        //   apr: apr.valueOf(),
        //   rewardYearlyUsd: rewardYearlyUsd.valueOf(),
        //   depositTokenStakedUsd: depositTokenStakedUsd.valueOf(),
        //   depositTokenPrice: depositTokenPrice,
        //   pricePerShare,
        // });
      } else {
        stakePoolInfo.apr = {
          yearlyAPR: 0,
          weeklyAPR: 0,
          dailyAPR: 0,
        };
      }

      if (account) {
        let stakeTokenContract = getLpContract(stakePoolInfo.stakeToken.address);

        stakePoolInfo.rewardsEarned = utils.formatUnits(
          await poolChef.pendingReward(account),
          stakePoolInfo.rewardToken.decimals
        );

        const userInfo = await poolChef.userInfo(account);

        stakePoolInfo.userTotalStaked = utils.formatUnits(userInfo.amount, stakePoolInfo.stakeToken.decimals);

        stakePoolInfo.poolShare = new BigNumberJS(stakePoolInfo.userTotalStaked)
          .dividedBy(stakePoolInfo.totalStaked)
          .times(100)
          .toString();

        stakePoolInfo.hasStaked = !(userInfo.amount as BigNumber).isZero();

        const allowance: BigNumber = await stakeTokenContract.allowance(account, stakePoolInfo.address);

        stakePoolInfo.hasApprovedPool = !allowance.isZero();
      }

      return stakePoolInfo;
    } catch (e) {
      console.error(e);
      return stakePoolInfo;
    }
  };
}

export function useFetchVaultStakePools() {
  const fetchStakingPoolRq = useFetchVaultStakingPoolRequest();
  const currentBlock = useCurrentBlockNumber();
  const { account } = useActiveWeb3React();

  const vaultStakeQueries = useQueries(
    vaultStakingPools.map((stakePool) => {
      return {
        enabled: !!currentBlock,
        queryKey: ["vault-stake-pool", stakePool.address, account],
        queryFn: () => fetchStakingPoolRq(stakePool),
      };
    })
  );

  return vaultStakeQueries;
}

export function useApproveVaultStakePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", address, account]);
      const lpContract = getLpContract(pool.stakeToken.address);

      await approveLpContract(lpContract, pool.address);
      return address;
    },

    {
      onSuccess: (address) => {
        const stakePool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", address, account]);

        queryClient.setQueryData(["vault-stake-pool", address, account], {
          ...stakePool,
          hasApprovedPool: true,
        });

        const token = stakePool?.stakeToken.symbol;
        ReactGA.event({
          category: "Vault Staking Pool Approval",
          action: `Approving ${token}`,
          label: token,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePool][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return approveMutation;
}

export function useDepositIntoVaultStakePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getStakePoolContract = useStakePoolContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", id, account]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.deposit(utils.parseUnits(amount, pool.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", id, account]);
        queryClient.invalidateQueries(["vault-stake-pool", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositIntoPool][error] general error`, {
          data,
        });

        toast({
          title: "Error depositing token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return depositMutation;
}

export function useVaultStakeWithdraw() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getStakePoolContract = useStakePoolContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", id, account]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.withdraw(utils.parseUnits(amount, pool.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<VaultStakeInfo>(["vault-stake-pool", id, account]);
        queryClient.invalidateQueries(["vault-stake-pool", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useStakeWithdraw][error] general error`, {
          data,
        });

        toast({
          title: "Error withdrawing stake token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return withdrawMutation;
}

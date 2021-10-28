import { useMutation, useQueries, useQueryClient } from "react-query";
import {
  useCustomMasterChef,
  useUniPair,
  useVaultContract,
  useDfynFarmContract,
  useERC20,
  useVaultRewardPoolContract,
  useVaultDualRewardPoolContract,
} from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { useFetchVaultPools } from "./pools";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Vault, vaults } from "config/vaults";
import { Pool, pools } from "config/pools";
import { BigNumber, utils } from "ethers";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { approveLpContract } from "web3-functions";
import {
  getDualRewardPoolVaultApy,
  getDualVaultApy,
  getMasterChefVaultApy,
  getRewardPoolVaultApy,
} from "web3-functions/aprs";
import { useFetchMainPool as useFetchBankMainPool } from "./bank";

function useFetchVaultsRequest() {
  const queryClient = useQueryClient();
  const getMasterChef = useCustomMasterChef();
  const getVaultContract = useVaultContract();
  const getPairContract = useUniPair();
  const getErc20 = useERC20();
  const getDfynFarmContract = useDfynFarmContract();
  const getRewardPoolContract = useVaultRewardPoolContract();
  const getDualRewardPoolContract = useVaultDualRewardPoolContract();
  const bankMainPool = useFetchBankMainPool();
  const { account, library } = useActiveWeb3React();

  return async (vault: Vault, poolPid?: number) => {
    try {
      const vaultContract = getVaultContract(vault.address);

      // get prices
      const lpContract = getPairContract(vault.stakeToken.address);
      const totalSupply = utils.formatUnits(await lpContract.totalSupply(), vault.stakeToken.decimals);

      vault.stakeToken.price = await fetchPairPrice(vault.pairs[0], vault.pairs[1], totalSupply, library, vault.amm);
      vault.totalStaked = utils.formatUnits(await vaultContract.balance(), vault.stakeToken.decimals);

      if (vault.isActive && vault.type === "masterchef") {
        const masterChef = getMasterChef(vault.masterChefAddress);
        vault.projectToken.price = await fetchPrice(vault.projectToken, library);

        // caculate apy
        const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();
        const farmInfo = await masterChef.poolInfo(vault.farmPid);

        const multiplier = farmInfo.allocPoint.toString();
        const depositFees = BigNumber.from(farmInfo.depositFeeBP).div(100).toNumber();
        const farmLpContract = getPairContract(farmInfo.lpToken);

        const totalStakedInFarm = utils.formatUnits(
          await farmLpContract.balanceOf(masterChef.address),
          await farmLpContract.decimals()
        );

        const apy = await getMasterChefVaultApy({
          address: farmLpContract.address,
          amm: vault.amm,
          multiplier,
          tokenPerBlock: vault.tokenPerBlock,
          totalAllocPoints,
          depositFees,
          performanceFee: vault.performanceFee,
          rewardToken: vault.projectToken,
          stakeToken: vault.stakeToken,
          totalStakedInFarm,
        });

        const dailyApy = Math.pow(10, Math.log10(apy.totalApy + 1) / 365) - 1;

        vault.apy = {
          yearly: apy.totalApy * 100,
          daily: dailyApy * 100,
        };

        // add boosted values
        const pool = queryClient.getQueryData<Pool>(["pool", poolPid, account]);
        if (pool) {
          vault.apy.boostedYearly = (pool.apr?.yearlyAPR || 0) + vault.apy.yearly;
          vault.apy.dailyWithPool = (pool.apr?.dailyAPR || 0) + vault.apy.daily;
        }

        const bankPool = bankMainPool.data;
        if (bankPool) {
          vault.apy.boostedYearly = (bankPool?.apr || 0) + (vault.apy.boostedYearly || vault.apy.yearly);
          vault.apy.dailyAll = (bankPool?.apr / 365 || 0) + vault.apy.daily + (vault.apy.dailyWithPool || 0);
        }
      } else if (vault.isActive && vault.type === "dual") {
        vault.farmRewardTokens[0].price = await fetchPrice(vault.farmRewardTokens[0], library);
        vault.farmRewardTokens[1].price = await fetchPrice(vault.farmRewardTokens[1], library);

        const dfynFarm = getDfynFarmContract(vault.farmAddress);

        const token0RewardRate = (await dfynFarm.tokenRewardRate(vault.farmRewardTokens[0].address)).toString();
        const token1RewardRate = (await dfynFarm.tokenRewardRate(vault.farmRewardTokens[1].address)).toString();

        const totalStakedInFarm = utils.formatUnits(
          await lpContract.balanceOf(dfynFarm.address),
          await lpContract.decimals()
        );

        const apy = await getDualVaultApy({
          address: vault.stakeToken.address,
          amm: vault.amm,
          stakePrice: vault.stakeToken.price,
          totalStakedInFarm,
          token0RewardRate,
          token0Price: vault.farmRewardTokens[0].price,
          token0Decimals: vault.farmRewardTokens[0].decimals,
          token1RewardRate,
          token1Price: vault.farmRewardTokens[1].price,
          token1Decimals: vault.farmRewardTokens[1].decimals,
          performanceFee: vault.performanceFee,
        });

        const dailyApy = Math.pow(10, Math.log10(apy.totalApy + 1) / 365) - 1;

        vault.apy = {
          yearly: apy.totalApy * 100,
          daily: dailyApy * 100,
        };

        // add boosted values
        const pool = queryClient.getQueryData<Pool>(["pool", poolPid, account]);
        if (pool) {
          vault.apy.boostedYearly = (pool.apr?.yearlyAPR || 0) + vault.apy.yearly;
          vault.apy.dailyWithPool = (pool.apr?.dailyAPR || 0) + vault.apy.daily;
        }

        const bankPool = bankMainPool.data;
        if (bankPool) {
          vault.apy.boostedYearly = (bankPool?.apr || 0) + (vault.apy.boostedYearly || vault.apy.yearly);
          vault.apy.dailyAll = (bankPool?.apr / 365 || 0) + vault.apy.daily + (vault.apy.dailyWithPool || 0);
        }
      } else if (vault.isActive && vault.type === "rewardPool") {
        vault.farmRewardToken.price = await fetchPrice(vault.farmRewardToken, library);
        let rewardTokenPrice = vault.farmRewardToken.price;

        if (vault.farmXTokenAddress) {
          const farmRewardToken = getErc20(vault.farmRewardToken.address);
          const farmRewardXToken = getErc20(vault.farmXTokenAddress);

          const stakedInXPool = (await farmRewardToken.balanceOf(vault.farmXTokenAddress)).toString();
          const totalXSuppy = (await farmRewardXToken.totalSupply()).toString();

          rewardTokenPrice = new BigNumberJS(stakedInXPool)
            .times(vault.farmRewardToken.price)
            .dividedBy(totalXSuppy)
            .toString();
        }

        const rewardPool = getRewardPoolContract(vault.rewardPool);
        const totalSupply = (await rewardPool.totalSupply()).toString();
        const rewardRate = (await rewardPool.rewardRate()).toString();

        const apy = await getRewardPoolVaultApy({
          address: vault.stakeToken.address,
          amm: vault.amm,
          rewardPoolTotalSupply: totalSupply.toString(),
          stakeTokenPrice: vault.stakeToken.price,
          stakeTokenDecimals: vault.stakeToken.decimals,
          rewardRate,
          rewardTokenPrice,
          rewardTokenDecimals: "1e18",
          performanceFee: vault.performanceFee,
        });

        const dailyApy = Math.pow(10, Math.log10(apy.totalApy + 1) / 365) - 1;

        vault.apy = {
          yearly: apy.totalApy * 100,
          daily: dailyApy * 100,
        };

        // add boosted values
        const pool = queryClient.getQueryData<Pool>(["pool", poolPid, account]);
        if (pool) {
          vault.apy.boostedYearly = (pool.apr?.yearlyAPR || 0) + vault.apy.yearly;
          vault.apy.dailyWithPool = (pool.apr?.dailyAPR || 0) + vault.apy.daily;
        }

        const bankPool = bankMainPool.data;
        console.log({ bankPool, bankMainPool });
        if (bankPool) {
          vault.apy.boostedYearly = (bankPool?.apr || 0) + (vault.apy.boostedYearly || vault.apy.yearly);
          vault.apy.dailyAll = (bankPool?.apr / 365 || 0) + vault.apy.daily + (vault.apy.dailyWithPool || 0);
        }
      } else if (vault.isActive && vault.type === "dualRewardPool") {
        vault.farmRewardTokens[0].price = await fetchPrice(vault.farmRewardTokens[0], library);
        vault.farmRewardTokens[1].price = await fetchPrice(vault.farmRewardTokens[1], library);

        let rewardTokenAPrice = vault.farmRewardTokens[0].price;
        let rewardTokenBPrice = vault.farmRewardTokens[1].price;

        if (vault.farmXTokenAddress) {
          const farmRewardToken = getErc20(vault.farmRewardTokens[0].address);
          const farmRewardXToken = getErc20(vault.farmXTokenAddress);

          const stakedInXPool = (await farmRewardToken.balanceOf(vault.farmXTokenAddress)).toString();
          const totalXSuppy = (await farmRewardXToken.totalSupply()).toString();

          rewardTokenAPrice = new BigNumberJS(stakedInXPool)
            .times(vault.farmRewardTokens[0].price)
            .dividedBy(totalXSuppy)
            .toString();
        }

        const rewardPool = getDualRewardPoolContract(vault.rewardPool);
        const totalSupply = (await rewardPool.totalSupply()).toString();
        const rewardRateA = (await rewardPool.rewardRateA()).toString();
        const rewardRateB = (await rewardPool.rewardRateB()).toString();

        const apy = await getDualRewardPoolVaultApy({
          address: vault.stakeToken.address,
          amm: vault.amm,
          rewardPoolTotalSupply: totalSupply.toString(),
          stakeTokenPrice: vault.stakeToken.price,
          stakeTokenDecimals: vault.stakeToken.decimals,
          rewardRateA,
          rewardTokenAPrice,
          rewardTokenADecimals: "1e18",
          rewardRateB,
          rewardTokenBPrice,
          rewardTokenBDecimals: "1e18",
          performanceFee: vault.performanceFee,
        });

        const dailyApy = Math.pow(10, Math.log10(apy.totalApy + 1) / 365) - 1;

        vault.apy = {
          yearly: apy.totalApy * 100,
          daily: dailyApy * 100,
        };

        // add boosted values
        const pool = queryClient.getQueryData<Pool>(["pool", poolPid, account]);
        if (pool) {
          vault.apy.boostedYearly = (pool.apr?.yearlyAPR || 0) + vault.apy.yearly;
          vault.apy.dailyWithPool = (pool.apr?.dailyAPR || 0) + vault.apy.daily;
        }

        const bankPool = bankMainPool.data;
        if (bankPool) {
          vault.apy.boostedYearly = (bankPool?.apr || 0) + (vault.apy.boostedYearly || vault.apy.yearly);
          vault.apy.dailyAll = (bankPool?.apr / 365 || 0) + vault.apy.daily + (vault.apy.dailyWithPool || 0);
        }
      } else {
        vault.apy = {
          yearly: 0,
          daily: 0,
        };
      }

      // USER data
      if (account) {
        let userShares = await vaultContract.balanceOf(account);
        let pricePerShare = await vaultContract.getPricePerFullShare();

        userShares = utils.formatUnits(userShares, vault.stakeToken.decimals);
        pricePerShare = utils.formatEther(pricePerShare);

        vault.userTotalStaked = new BigNumberJS(userShares).times(pricePerShare).toString();
        vault.userAvailableToUnstake = new BigNumberJS(userShares).toFixed(5).toString();

        vault.hasStaked = !new BigNumberJS(vault.userTotalStaked).isZero();

        const allowance: BigNumber = await lpContract.allowance(account, vault.address);
        vault.hasApprovedPool = !allowance.isZero();
      }

      return vault;
    } catch (err) {
      console.error(err);
      return vault;
    }
  };
}

export function useFetchVaults() {
  useFetchVaultPools();

  const fetchVaultRq = useFetchVaultsRequest();
  const { account } = useActiveWeb3React();
  const bankMainPool = useFetchBankMainPool();

  const vaultQueries = useQueries(
    vaults.map((vault) => {
      const pool = pools.find((pool) => pool.stakeToken.address.toLowerCase() === vault.address.toLowerCase());
      return {
        queryKey: ["vault", vault.address, account],
        queryFn: () => fetchVaultRq(vault, pool.pid),
        enabled: !!bankMainPool.data,
      };
    })
  );

  return vaultQueries;
}

export function useApproveVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getPairContract = useUniPair();
  const toast = useToast();

  const approveMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", address, account]);
      const lpContract = getPairContract(vault.stakeToken.address);

      await approveLpContract(lpContract, vault.address);
      return address;
    },

    {
      onSuccess: (address) => {
        const vault = queryClient.getQueryData<Vault>(["vault", address, account]);

        queryClient.setQueryData(["vault", address, account], {
          ...vault,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${vault.stakeToken.symbol}`,
          label: vault.stakeToken.symbol,
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

export function useDepositIntoVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.deposit(utils.parseUnits(amount, vault.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${vault.stakeToken.symbol} into Vault`,
          value: parseInt(amount, 10),
          label: vault.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositIntoVault][error] general error`, {
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

export function useWithdrawFromVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.withdraw(utils.parseUnits(amount, vault.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { amount, id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          value: parseInt(amount, 10),
          label: vault.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdraw][error] general error`, {
          data,
        });

        toast({
          title: "Error withdrawing token",
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

export function useWithdrawAllFromVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id }: { id: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.withdrawAll();
      await tx.wait();
    },
    {
      onSuccess: (_, { id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          label: vault.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdraw][error] general error`, {
          data,
        });

        toast({
          title: "Error withdrawing token",
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

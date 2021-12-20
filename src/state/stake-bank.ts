import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useStakeBankContract } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { StakeBankInfo, stakingBankPools } from "config/stake-bank";
import { BigNumber, utils } from "ethers";
import { approveLpContract } from "web3-functions";
import { fetchPrice } from "web3-functions/prices";
import { getPoolApr } from "web3-functions/utils";
import { BLOCKS_PER_SECOND, SECONDS_PER_WEEK } from "config/constants";

function useFetchStakingPoolRequest() {
  const getLpContract = useERC20();
  const getStakePoolContract = useStakeBankContract();
  const currentBlock = useCurrentBlockNumber();
  const { account, library } = useActiveWeb3React();

  return async (stakePoolInfo: StakeBankInfo) => {
    try {
      const poolChef = getStakePoolContract(stakePoolInfo.address);
      const endBlock = await poolChef.bonusEndBlock();

      stakePoolInfo.rewardEndBlock = endBlock.toString();
      stakePoolInfo.active = stakePoolInfo.active
        ? endBlock.sub(currentBlock || 0).gt(0)
        : false;

      const totalStaked = (await poolChef.totalStakeTokenBalance()).toString();

      stakePoolInfo.totalStaked = utils.formatUnits(
        totalStaked,
        stakePoolInfo.stakeToken.decimals
      );

      // TOKEN PRICE
      stakePoolInfo.stakeToken.price = await fetchPrice(
        stakePoolInfo.stakeToken,
        library
      );
      stakePoolInfo.rewardToken.price = await fetchPrice(
        stakePoolInfo.rewardToken,
        library
      );
      // calculate APR
      if (stakePoolInfo.active) {
        const rewardPerBlock = utils.formatUnits(
          await poolChef.rewardPerBlock(),
          stakePoolInfo.rewardToken.decimals
        );
        const totalAllocPoints = (
          await poolChef.poolInfo()
        ).allocPoint.toNumber();
        const rewardsPerWeek = new BigNumberJS(rewardPerBlock)
          .times(SECONDS_PER_WEEK / BLOCKS_PER_SECOND)
          .toNumber();
        const multiplier = 1000; // todo: move to config

        const poolRewardsPerWeek = new BigNumberJS(multiplier)
          .div(totalAllocPoints)
          .times(rewardsPerWeek)
          .toNumber();

        stakePoolInfo.apr = getPoolApr(
          parseFloat(stakePoolInfo.rewardToken.price || "0"),
          poolRewardsPerWeek,
          parseFloat(stakePoolInfo.stakeToken.price || "0"),
          parseFloat(stakePoolInfo.totalStaked || "0")
        );
      } else {
        stakePoolInfo.apr = {
          yearlyAPR: 0,
          weeklyAPR: 0,
          dailyAPR: 0,
        };
      }

      if (account) {
        let stakeTokenContract = getLpContract(
          stakePoolInfo.stakeToken.address
        );

        stakePoolInfo.rewardsEarned = utils.formatUnits(
          await poolChef.pendingReward(account),
          stakePoolInfo.rewardToken.decimals
        );

        const userInfo = await poolChef.userInfo(account);

        stakePoolInfo.userTotalStaked = utils.formatUnits(
          userInfo.amount,
          stakePoolInfo.stakeToken.decimals
        );

        stakePoolInfo.hasStaked = !(userInfo.amount as BigNumber).isZero();

        const allowance: BigNumber = await stakeTokenContract.allowance(
          account,
          stakePoolInfo.address
        );

        stakePoolInfo.hasApprovedPool = !allowance.isZero();
      }
      let stakeTokenContract = getLpContract(stakePoolInfo.stakeToken.address);
      stakePoolInfo.stakeToken.totalSupply =
        await stakeTokenContract.totalSupply();
      stakePoolInfo.stakeToken.percentageLocked =
        (totalStaked * 100) / stakePoolInfo.stakeToken.totalSupply;

      return stakePoolInfo;
    } catch (e) {
      console.error(e);
      return stakePoolInfo;
    }
  };
}

export function useFetchStakePools() {
  const fetchStakingPoolRq = useFetchStakingPoolRequest();
  const currentBlock = useCurrentBlockNumber();
  const { account } = useActiveWeb3React();
  
  if (stakingBankPools.some((c) => !c.isSpecial)) {
    const partnerPools = stakingBankPools.filter((c) => !c.isSpecial);
    const farmQueries = useQueries(
      partnerPools.map((stakePool) => {
        if (!stakePool.isSpecial)
          return {
            enabled: !!currentBlock,
            queryKey: ["bank-pool", stakePool.address, account],
            queryFn: () => fetchStakingPoolRq(stakePool),
          };
      })
    );

    return farmQueries;
  }
}

export function useMainBankStake() {
  const fetchStakingPoolRq = useFetchStakingPoolRequest();
  const currentBlock = useCurrentBlockNumber();
  const { account } = useActiveWeb3React();

  const statQuery = useQuery({
    enabled: !!currentBlock,
    queryKey: ["bank-pool", stakingBankPools[0].address, account],
    queryFn: () => fetchStakingPoolRq(stakingBankPools[0]),
  });

  return statQuery;
}

export function useBankStakeStats() {
  const mainPool = useMainBankStake();
  const pools = useFetchStakePools();
  const currentBlock = useCurrentBlockNumber();
  const isLoading = (pools && pools.some((f) => f.status === "loading")) || mainPool.status === "loading";

  const statQuery = useQuery({
    enabled: !isLoading && !!currentBlock,
    refetchInterval: 1 * 60 * 1000,
    queryKey: ["bank-global-stats"],
    queryFn: () => {
      const totalPlutusLocked = pools ? 
        pools
          .reduce((total, curr: any) => {
            return total.plus(curr.data?.totalStaked || 0);
          }, new BigNumberJS(0))
          .plus(mainPool.data?.totalStaked) || new BigNumberJS(0)
          :
          new BigNumberJS(mainPool.data?.totalStaked) || new BigNumberJS(0);
      const plutusSupply =
        utils.formatUnits(
          mainPool.data?.stakeToken?.totalSupply,
          mainPool?.data?.stakeToken?.decimals
        ) || 0;
      const percentagePlutusLocked =
        (Number(totalPlutusLocked) * 100) / Number(plutusSupply);
      const totalValueLocked = totalPlutusLocked
        .times(Number(mainPool.data?.stakeToken?.price))
        .toString();

      const plutusLockedString = totalPlutusLocked.toString();

      return {
        plutusLockedString,
        percentagePlutusLocked,
        totalValueLocked,
      };
    },
  });
  return statQuery;
}

export function useApproveStakePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<StakeBankInfo>([
        "bank-pool",
        address,
        account
      ]);
      const lpContract = getLpContract(pool.stakeToken.address);
      await approveLpContract(lpContract, pool.address);
      // const pool = stakingBankPools.find((c) => c.address === address);
      
      return address;
    },

    {
      onSuccess: (address) => {
        const stakePool = queryClient.getQueryData<StakeBankInfo>([
          "bank-pool",
          address,
          account,
        ]);
        queryClient.setQueryData(["bank-pool", address, account], {
          ...stakePool,
          hasApprovedPool: true,
        });

        const token = stakePool?.stakeToken.symbol;
        ReactGA.event({
          category: "Staking Pool Approval",
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

export function useDepositIntoStakePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getStakePoolContract = useStakeBankContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ address, amount }: { address: string; amount: string }) => {
      if (!account) throw new Error("No connected account");
      const pool = queryClient.getQueryData<StakeBankInfo>([
        "bank-pool",
        address,
        account,
      ]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.deposit(
        utils.parseUnits(amount, pool.stakeToken.decimals)
      );
      await tx.wait();
    },
    {
      onSuccess: (_, { address, amount }) => {
        const pool = queryClient.getQueryData<StakeBankInfo>([
          "bank-pool",
          address,
          account,
        ]);
        queryClient.invalidateQueries(["bank-pool", address, account]);
        queryClient.invalidateQueries(["bank-global-stats"]);

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

export function useStakeWithdraw() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getStakePoolContract = useStakeBankContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<StakeBankInfo>([
        "bank-pool",
        address,
        account,
      ]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.withdrawReward();
      await tx.wait();
    },
    {
      onSuccess: (_,  address ) => {
        const pool = queryClient.getQueryData<StakeBankInfo>([
          "bank-pool",
          address,
          account,
        ]);
        queryClient.invalidateQueries(["bank-pool", address, account]);
        queryClient.invalidateQueries(["bank-global-stats"]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${pool.stakeToken.symbol}`,
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

import { useMutation, useQueries, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useStakePoolContract } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { ApolloStakeInfo, apolloStakingPools } from "config/stake-apollo";
import { BigNumber, utils } from "ethers";
import { approveLpContract } from "web3-functions";
import { fetchPrice } from "web3-functions/prices";

function useFetchStakingPoolRequest() {
  const getLpContract = useERC20();
  const getStakePoolContract = useStakePoolContract();
  const currentBlock = useCurrentBlockNumber();
  const { account, library } = useActiveWeb3React();

  return async (stakePoolInfo: ApolloStakeInfo) => {
    try {
      const poolChef = getStakePoolContract(stakePoolInfo.address);
      const endBlock = await poolChef.bonusEndBlock();

      stakePoolInfo.rewardEndBlock = endBlock.toString();
      stakePoolInfo.active = stakePoolInfo.active ? endBlock.sub(currentBlock || 0).gt(0) : false;

      const totalStaked = (await poolChef.totalStakeTokenBalance()).toString();

      stakePoolInfo.totalStaked = utils.formatUnits(totalStaked, stakePoolInfo.stakeToken.decimals);

      // TOKEN PRICE
      stakePoolInfo.rewardToken.price = await fetchPrice(stakePoolInfo.rewardToken, library);

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

export function useFetchStakePools() {
  const fetchStakingPoolRq = useFetchStakingPoolRequest();
  const currentBlock = useCurrentBlockNumber();
  const { account } = useActiveWeb3React();

  const farmQueries = useQueries(
    apolloStakingPools.map((stakePool) => {
      return {
        enabled: !!currentBlock,
        queryKey: ["pre-apollo-stake", stakePool.address, account],
        queryFn: () => fetchStakingPoolRq(stakePool),
      };
    })
  );

  return farmQueries;
}

export function useApproveStakePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", address, account]);
      const lpContract = getLpContract(pool.stakeToken.address);

      await approveLpContract(lpContract, pool.address);
      return address;
    },

    {
      onSuccess: (address) => {
        const stakePool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", address, account]);

        queryClient.setQueryData(["pre-apollo-stake", address, account], {
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
  const getStakePoolContract = useStakePoolContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", id, account]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.deposit(utils.parseUnits(amount, pool.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", id, account]);
        queryClient.invalidateQueries(["pre-apollo-stake", id, account]);

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
  const getStakePoolContract = useStakePoolContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", id, account]);
      const poolChef = getStakePoolContract(pool.address);

      const tx = await poolChef.withdraw(utils.parseUnits(amount, pool.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<ApolloStakeInfo>(["pre-apollo-stake", id, account]);
        queryClient.invalidateQueries(["pre-apollo-stake", id, account]);

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

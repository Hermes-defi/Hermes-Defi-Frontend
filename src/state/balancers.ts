import { useMutation, useQueries, useQueryClient } from "react-query";
import { useERC20, useMasterChef } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { usePlutusPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Balancer, balancers } from "config/balancers";
import { BigNumber, constants, utils } from "ethers";
import { plutusPerBlock } from "config/constants";
import { fetchBalancerPrice } from "web3-functions/prices";
import { getPoolApr } from "web3-functions/utils";
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";

function useFetchBalancersRequest() {
  const plutusPrice = usePlutusPrice();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const { account } = useActiveWeb3React();

  return async (balancer: Balancer) => {
    const newBal = balancer;

    // Balancer data
    let masterChefInfo = await masterChef.poolInfo(balancer.pid);

    newBal.multiplier = masterChefInfo.allocPoint.toString();
    newBal.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();

    // newBal.isActive = masterChefInfo.allocPoint.toString() !== "0";

    // Token data
    newBal.stakeToken.address = masterChefInfo.lpToken;
    const lpContract = getLpContract(newBal.stakeToken.address);

    newBal.totalStaked = utils.formatUnits(
      await lpContract.balanceOf(masterChef.address),
      newBal.stakeToken.decimals
    );

    newBal.stakeToken.price = await fetchBalancerPrice(balancer.balancerAddress);

    // APR data
    const rewardsPerWeek = plutusPerBlock * (604800 / 2.1);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(newBal.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    newBal.apr = getPoolApr(
      parseFloat(plutusPrice.data || "0"),
      poolRewardsPerWeek,
      parseFloat(newBal.stakeToken.price || "0"),
      parseFloat(newBal.totalStaked || "0")
    );

    // USER data
    if (account) {
      newBal.rewardsEarned = utils.formatEther(await masterChef.pendingApollo(balancer.pid, account)); // TODO: shoudn't be pendingPlutus instead?

      const userInfo = await masterChef.userInfo(balancer.pid, account);

      newBal.userTotalStaked = utils.formatUnits(userInfo.amount, newBal.stakeToken.decimals);
      newBal.hasStaked = !(userInfo.amount as BigNumber).isZero();

      const allowance: BigNumber = await lpContract.allowance(account, masterChef.address);
      newBal.hasApprovedPool = !allowance.isZero();
    }

    return newBal;
  };
}

export function useFetchBalancers() {
  const plutusPrice = usePlutusPrice();
  const fetchBalRq = useFetchBalancersRequest();
  const { account } = useActiveWeb3React();

  const balancersQueries = useQueries(
    balancers.map((bal) => {
      return {
        enabled: !!plutusPrice.data,
        queryKey: ["balancer", bal.pid, account],
        queryFn: () => fetchBalRq(bal),
      };
    })
  );

  return balancersQueries;
}

export function useApproveBalancer() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");

      const bal = queryClient.getQueryData<Balancer>(["balancer", pid, account]);
      const lpContract = getLpContract(bal.stakeToken.address);

      await approveLpContract(lpContract, masterChef.address);
      return pid;
    },

    {
      onSuccess: (pid) => {
        const bal = queryClient.getQueryData<Balancer>(["balancer", pid, account]);

        queryClient.setQueryData(["balancer", pid, account], {
          ...bal,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${bal.stakeToken.symbol}`,
          label: bal.stakeToken.symbol,
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

export function useDepositIntoBalancer() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const bal = queryClient.getQueryData<Balancer>(["balancer", id, account]);
      await depositIntoPool(masterChef, id, amount, constants.AddressZero, bal.stakeToken.decimals);
    },
    {
      onSuccess: (_, { id, amount }) => {
        const bal = queryClient.getQueryData<Balancer>(["balancer", id, account]);
        queryClient.invalidateQueries(["balancer", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${bal.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: bal.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDeposit][error] general error`, { data });

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

export function useWithdrawFromBalancer() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const bal = queryClient.getQueryData<Balancer>(["balancer", id, account]);
      await withdrawFromPool(masterChef, id, amount, bal.stakeToken.decimals);
    },
    {
      onSuccess: (_, { amount, id }) => {
        const bal = queryClient.getQueryData<Balancer>(["balancer", id, account]);
        queryClient.invalidateQueries(["balancer", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${bal.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: bal.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdraw][error] general error`, { data });

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

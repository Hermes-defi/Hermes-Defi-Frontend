import { useMutation, useQueries, useQueryClient } from "react-query";
import { useMasterChef, useUniPair } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { useIrisPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Farm, farms } from "config/farms";
import { BigNumber, constants, utils } from "ethers";
import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID, irisPerBlock } from "config/constants";
import { fetchPairPrice } from "web3-functions/prices";
import { getPoolApr } from "web3-functions/utils";
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";

function useFetchFarmRequest() {
  const irisPrice = useIrisPrice();
  const masterChef = useMasterChef();
  const getPairContract = useUniPair();
  const { account, library } = useActiveWeb3React();

  return async (farm: Farm) => {
    const newFarm = farm;

    // Farm data
    let masterChefInfo = await masterChef.poolInfo(farm.pid);

    newFarm.multiplier = masterChefInfo.allocPoint.toString();
    newFarm.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();

    newFarm.badge = (newFarm.badge || []).concat(`${newFarm.multiplier}x`);
    if (newFarm.depositFees === 0) {
      newFarm.badge.push("No Fees");
    }

    newFarm.isActive = masterChefInfo.allocPoint.toString() !== "0";

    // Token data
    newFarm.stakeToken.address = masterChefInfo.lpToken;
    const lpContract = getPairContract(newFarm.stakeToken.address);

    newFarm.totalStaked = utils.formatUnits(
      await lpContract.balanceOf(masterChef.address),
      newFarm.stakeToken.decimals
    );

    const totalSupply = utils.formatUnits(
      await lpContract.totalSupply(),
      newFarm.stakeToken.decimals
    );

    const token0 = new Token(
      DEFAULT_CHAIN_ID,
      newFarm.pairs[0].tokenAddress,
      newFarm.pairs[0].tokenDecimals,
      newFarm.pairs[0].tokenName
    );

    const token1 = new Token(
      DEFAULT_CHAIN_ID,
      newFarm.pairs[1].tokenAddress,
      newFarm.pairs[1].tokenDecimals,
      newFarm.pairs[1].tokenName
    );

    newFarm.stakeToken.price = await fetchPairPrice(token0, token1, totalSupply, library);

    // APR data
    const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(newFarm.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    newFarm.apr = getPoolApr(
      parseFloat(irisPrice.data || "0"),
      poolRewardsPerWeek,
      parseFloat(newFarm.stakeToken.price || "0"),
      parseFloat(newFarm.totalStaked || "0")
    );

    // USER data
    if (account) {
      newFarm.rewardsEarned = utils.formatEther(await masterChef.pendingIris(farm.pid, account));

      const userInfo = await masterChef.userInfo(farm.pid, account);

      newFarm.userTotalStaked = utils.formatUnits(userInfo.amount, newFarm.stakeToken.decimals);
      newFarm.hasStaked = !(userInfo.amount as BigNumber).isZero();

      const allowance: BigNumber = await lpContract.allowance(account, masterChef.address);
      newFarm.hasApprovedPool = !allowance.isZero();
    }

    return newFarm;
  };
}

export function useFetchFarms(filters: { active: boolean; stakedOnly: boolean }) {
  const irisPrice = useIrisPrice();
  const fetchFarmRq = useFetchFarmRequest();
  const { account } = useActiveWeb3React();

  const farmQueries = useQueries(
    farms.map((farm) => {
      return {
        enabled: !!irisPrice.data,
        queryKey: ["farm", farm.pid, account],
        queryFn: () => fetchFarmRq(farm),
      };
    })
  );

  return farmQueries;
}

export function useApproveFarm() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getPairContract = useUniPair();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");

      const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);
      const lpContract = getPairContract(farm.stakeToken.address);

      await approveLpContract(lpContract, masterChef.address);
      return pid;
    },

    {
      onSuccess: (pid) => {
        const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);

        queryClient.setQueryData(["farm", pid, account], {
          ...farm,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${farm.stakeToken.symbol}`,
          label: farm.stakeToken.symbol,
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

export function useDepositIntoFarm() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);
      await depositIntoPool(
        masterChef,
        pid,
        amount,
        constants.AddressZero,
        farm.stakeToken.decimals
      );
    },
    {
      onSuccess: (_, { pid, amount }) => {
        const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);
        queryClient.invalidateQueries(["farm", pid, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${farm.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: farm.stakeToken.symbol,
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

export function useWithdrawFromFarm() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);
      await withdrawFromPool(masterChef, pid, amount, farm.stakeToken.decimals);
    },
    {
      onSuccess: (_, { amount, pid }) => {
        const farm = queryClient.getQueryData<Farm>(["farm", pid, account]);
        queryClient.invalidateQueries(["farm", pid, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${farm.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: farm.stakeToken.symbol,
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

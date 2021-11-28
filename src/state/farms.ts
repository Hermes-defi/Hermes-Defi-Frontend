import { useMutation, useQueries, useQueryClient } from "react-query";
import { useMasterChef, useUniPair } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { usePlutusPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Farm, farms } from "config/farms";
import { BigNumber, constants, utils } from "ethers";
import { BLOCKS_PER_SECOND, PLUTUS_PER_BLOCK, SECONDS_PER_WEEK } from 'config/constants';
import { fetchPairPrice } from "web3-functions/prices";
import { getPoolApr } from "web3-functions/utils";
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";

function useFetchFarmRequest() {
  const plutusPrice = usePlutusPrice();
  const masterChef = useMasterChef();
  const getPairContract = useUniPair();
  const { account, library } = useActiveWeb3React();

  return async (farm: Farm) => {
    const newFarm = farm;

    // Farm data
    let masterChefInfo = await masterChef.poolInfo(farm.pid);

    newFarm.multiplier = masterChefInfo.allocPoint.toString();
    newFarm.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();

    // newFarm.isActive = masterChefInfo.allocPoint.toString() !== "0";

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

    newFarm.stakeToken.price = await fetchPairPrice(
      newFarm.pairs[0],
      newFarm.pairs[1],
      totalSupply,
      library,
      farm.farmDx
    );

    // APR data
    const rewardsPerWeek = PLUTUS_PER_BLOCK * (SECONDS_PER_WEEK / BLOCKS_PER_SECOND);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(newFarm.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    newFarm.apr = newFarm.isActive
      ? getPoolApr(
          parseFloat(plutusPrice.data || "0"),
          poolRewardsPerWeek,
          parseFloat(newFarm.stakeToken.price || "0"),
          parseFloat(newFarm.totalStaked || "0")
        )
      : {
          yearlyAPR: 0,
          dailyAPR: 0,
          weeklyAPR: 0,
        };

    // USER data
    if (account) {
      newFarm.rewardsEarned = utils.formatEther(await masterChef.pendingApollo(farm.pid, account)); // TODO: shouldn be pendingRewards instead?

      const userInfo = await masterChef.userInfo(farm.pid, account);

      newFarm.userTotalStaked = utils.formatUnits(userInfo.amount, newFarm.stakeToken.decimals);
      newFarm.hasStaked = !(userInfo.amount as BigNumber).isZero();

      const allowance: BigNumber = await lpContract.allowance(account, masterChef.address);
      newFarm.hasApprovedPool = !allowance.isZero();
    }

    return newFarm;
  };
}

export function useFetchFarms() {
  const plutusPrice = usePlutusPrice();
  const fetchFarmRq = useFetchFarmRequest();
  const { account } = useActiveWeb3React();

  const farmQueries = useQueries(
    farms.map((farm) => {
      return {
        enabled: !!plutusPrice.data,
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
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const farm = queryClient.getQueryData<Farm>(["farm", id, account]);
      await depositIntoPool(
        masterChef,
        id,
        amount,
        constants.AddressZero,
        farm.stakeToken.decimals
      );
    },
    {
      onSuccess: (_, { id, amount }) => {
        const farm = queryClient.getQueryData<Farm>(["farm", id, account]);
        queryClient.invalidateQueries(["farm", id, account]);

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
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const farm = queryClient.getQueryData<Farm>(["farm", id, account]);
      await withdrawFromPool(masterChef, id, amount, farm.stakeToken.decimals);
    },
    {
      onSuccess: (_, { amount, id }) => {
        const farm = queryClient.getQueryData<Farm>(["farm", id, account]);
        queryClient.invalidateQueries(["farm", id, account]);

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

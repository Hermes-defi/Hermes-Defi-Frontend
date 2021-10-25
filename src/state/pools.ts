import { useMutation, useQueries, useQueryClient } from "react-query";
import { useERC20, useMasterChef, useVaultContract } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { useApolloPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Pool, pools } from "config/pools";
import { BigNumber, constants, utils } from "ethers";
import { apolloPerBlock } from "config/constants";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { getPoolApr } from "web3-functions/utils";
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";
import { vaults } from "config/vaults";

function useFetchPoolsRequest() {
  const apolloPrice = useApolloPrice();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const getVaultContract = useVaultContract();
  const { account, library } = useActiveWeb3React();

  return async (pool: Pool) => {
    const newPool = pool;

    // Farm data
    let masterChefInfo = await masterChef.poolInfo(pool.pid);

    newPool.multiplier = masterChefInfo.allocPoint.toString();
    newPool.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();

    newPool.isActive = masterChefInfo.allocPoint.toString() !== "0";

    // Token data
    newPool.stakeToken.address = masterChefInfo.lpToken;
    const lpContract = getLpContract(newPool.stakeToken.address);

    newPool.totalStaked = utils.formatUnits(
      await lpContract.balanceOf(masterChef.address),
      newPool.stakeToken.decimals
    );

    if (!newPool.vaultPool) {
      newPool.stakeToken.price = await fetchPrice(newPool.stakeToken, library);
    } else {
      // get vault details
      const poolVault = vaults.find((v) => v.address.toLowerCase() === newPool.stakeToken.address.toLowerCase());
      const poolVaultContract = getVaultContract(poolVault.address);

      const pricePerShare = utils.formatUnits(await poolVaultContract.getPricePerFullShare(), 18);
      const lpContract = getLpContract(poolVault.stakeToken.address);
      const vaultTotalSupply = utils.formatUnits(await lpContract.totalSupply(), poolVault.stakeToken.decimals);
      const depositTokenPrice = await fetchPairPrice(
        poolVault.pairs[0],
        poolVault.pairs[1],
        vaultTotalSupply,
        library,
        poolVault.amm
      );

      newPool.stakeToken.price = new BigNumberJS(depositTokenPrice).times(pricePerShare).toString();
    }

    // APR data
    const rewardsPerWeek = apolloPerBlock * (604800 / 2.1);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(newPool.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    newPool.apr = newPool.isActive
      ? getPoolApr(
          parseFloat(apolloPrice.data || "0"),
          poolRewardsPerWeek,
          parseFloat(newPool.stakeToken.price || "0"),
          parseFloat(newPool.totalStaked || "0")
        )
      : {
          yearlyAPR: 0,
          dailyAPR: 0,
          weeklyAPR: 0,
        };

    // USER data
    if (account) {
      newPool.rewardsEarned = utils.formatEther(await masterChef.pendingApollo(pool.pid, account));

      const userInfo = await masterChef.userInfo(pool.pid, account);

      newPool.userTotalStaked = utils.formatUnits(userInfo.amount, newPool.stakeToken.decimals);
      newPool.hasStaked = !(userInfo.amount as BigNumber).isZero();

      const allowance: BigNumber = await lpContract.allowance(account, masterChef.address);
      newPool.hasApprovedPool = !allowance.isZero();
    }

    return newPool;
  };
}

export function useFetchPools() {
  const apolloPrice = useApolloPrice();
  const fetchPoolRq = useFetchPoolsRequest();
  const { account } = useActiveWeb3React();

  const poolQueries = useQueries(
    pools.map((farm) => {
      return {
        enabled: !!apolloPrice.data,
        queryKey: ["pool", farm.pid, account],
        queryFn: () => fetchPoolRq(farm),
      };
    })
  );

  return poolQueries;
}

export function useApprovePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", pid, account]);
      const lpContract = getLpContract(pool.stakeToken.address);

      await approveLpContract(lpContract, masterChef.address);
      return pid;
    },

    {
      onSuccess: (pid) => {
        const pool = queryClient.getQueryData<Pool>(["pool", pid, account]);

        queryClient.setQueryData(["pool", pid, account], {
          ...pool,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${pool.stakeToken.symbol}`,
          label: pool.stakeToken.symbol,
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

export function useDepositIntoPool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
      await depositIntoPool(masterChef, id, amount, constants.AddressZero, pool.stakeToken.decimals);
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
        queryClient.invalidateQueries(["pool", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
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

export function useWithdrawFromPool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
      await withdrawFromPool(masterChef, id, amount, pool.stakeToken.decimals);
    },
    {
      onSuccess: (_, { amount, id }) => {
        const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
        queryClient.invalidateQueries(["pool", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
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

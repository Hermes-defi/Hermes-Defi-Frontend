import BigNumberJS from "bignumber.js";
import defaultContracts from "config/contracts";
import ReactGA from "react-ga";
import dayjs from "dayjs";

import { BurnAddress, DEFAULT_CHAIN_ID, irisPerBlock } from "config/constants";
import { balancersDefaultData, farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { BigNumber, constants, utils } from "ethers";
import { useMasterChef, useIrisToken, useERC20, useERC20_v2, useUniPair } from "hooks/contracts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { Token } from "quickswap-sdk";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { useIrisPrice, useTokenPrice } from "hooks/prices";
import { getPoolApr } from "web3-functions/utils";

export function useIrisData() {
  const { account } = useActiveWeb3React();
  const masterChef = useMasterChef();
  const irisToken = useIrisToken();

  const irisInWallet = useQuery("irisInWallet", async () => {
    return account ? utils.formatEther(await irisToken.balanceOf(account)) : "0.00";
  });

  const irisToHarvest = useQuery("irisToHarvest", async () => {
    const totalIrisToHarvest = [...farmsDefaultData, ...poolDefaultData].reduce(
      async (_total, pool) => {
        const total = await _total;
        const irisEarned = await masterChef.pendingIris(pool.pid, account);
        return total.add(irisEarned);
      },
      Promise.resolve(BigNumber.from(0))
    );

    return account ? utils.formatEther(await totalIrisToHarvest) : "0.00";
  });

  return { irisInWallet, irisToHarvest };
}

export function useIrisStats() {
  const irisStats = useQuery("irisStats", async () => {
    const resp = await fetch("/api/home/iris-stats");
    const { data } = await resp.json();

    return data;
  });

  return irisStats;
}

function useApr(pool: PoolInfo) {
  const irisPrice = useIrisPrice();
  const masterChef = useMasterChef();
  const lpContract = useERC20_v2(pool.lpAddress);

  const totalLpStaked = useQuery(["pool-total-staked", pool.pid, pool.lpAddress], async () => {
    return lpContract.balanceOf(defaultContracts.masterChef.address);
  });

  const tokenPrice = useTokenPrice(pool.lpAddress, pool.decimals, pool.lpToken);

  const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
  const totalAllocPoints = useQuery(
    ["pool-totalAllocPoints", pool.pid],
    async () => {
      return masterChef.totalAllocPoint();
    },
    { select: (points) => points.toNumber() }
  );

  const poolRewardsPerWeek = new BigNumberJS(pool.multiplier)
    .div(totalAllocPoints.data || 0)
    .times(rewardsPerWeek)
    .toNumber();

  const apr = getPoolApr(
    parseFloat(irisPrice.data || "0"),
    poolRewardsPerWeek,
    parseFloat(tokenPrice.data || "0"),
    parseFloat(utils.formatUnits(totalLpStaked.data, pool.decimals) || "0")
  );

  return apr;
}

export function useAPRStats() {
  const irisPrice = useIrisPrice();

  const maxAPRs = useQuery(["aprStats"], async () => {
    const resp = await fetch("/api/home/apr-stats");
    const { data } = await resp.json();

    return [Math.max(...data.farm), Math.max(...data.pool)];
  });

  return maxAPRs;
}

export function useHermesStats() {
  const hermesStats = useQuery("hermesStats", async () => {
    const resp = await fetch("/api/home/hermes-stats");
    const { data } = await resp.json();

    return data;
  });

  return hermesStats;
}

export function useTvlChart() {
  return useQuery("tvl-chart-data", async () => {
    const resp = await fetch("/api/tvl-chart");
    const data = await resp.json();

    // format data
    const formattedData = data.map((tvlData: { value: string; time: string }) => {
      const time = dayjs(tvlData.time).format("HH:mm");
      const value = parseInt(tvlData.value);

      return { time, value };
    });

    return formattedData;
  });
}

export function useHarvestAll(irisToHarvest: string) {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const toast = useToast();

  const harvestAll = useMutation(
    async () => {
      return Promise.all(
        [...farmsDefaultData, ...poolDefaultData, ...balancersDefaultData].map(async (pool) => {
          const lpContract = getLpContract(pool.lpAddress);
          const allowance: BigNumber = await lpContract.allowance(
            account,
            defaultContracts.masterChef.address
          );

          const hasApprovedPool = !allowance.isZero();

          if (!hasApprovedPool) return;

          const tx = await masterChef.deposit(
            pool.pid,
            utils.parseEther("0"),
            constants.AddressZero
          );
          await tx.wait();
        })
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("irisInWallet");
        queryClient.invalidateQueries("irisToHarvest");

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing from all pools and farms`,
          value: parseInt(irisToHarvest, 10),
        });
      },

      onError: ({ message, data }) => {
        toast({
          status: "error",
          position: "top-right",
          title: "Error harvesting IRIS",
          description: data?.message || message,
          isClosable: true,
        });
      },
    }
  );

  return harvestAll;
}

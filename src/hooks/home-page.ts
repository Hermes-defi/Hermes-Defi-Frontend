import BigNumberJS from "bignumber.js";
import defaultContracts from "config/contracts";
import ReactGA from "react-ga";
import dayjs from "dayjs";

import { BurnAddress } from "config/constants";
import { Pool, pools } from "config/pools";
import { BigNumber, constants, utils } from "ethers";
import { useMasterChef, useIrisToken, useERC20 } from "hooks/contracts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { useIrisPrice } from "hooks/prices";
import { useFetchFarms } from "state/farms";
import { useFetchVaults } from "state/vaults";
import { Farm, farms } from "config/farms";
import { Vault } from "config/vaults";
import { StakeInfo, stakingPools } from "config/stake";
import { useFetchPools } from "state/pools";
import { useFetchBalancers } from "state/balancers";
import { Balancer, balancers } from "config/balancers";
import { useFetchStakePools } from "state/stake";

export function useIrisData() {
  const { account } = useActiveWeb3React();
  const masterChef = useMasterChef();
  const irisToken = useIrisToken();

  const irisInWallet = useQuery("irisInWallet", async () => {
    return account ? utils.formatEther(await irisToken.balanceOf(account)) : "0.00";
  });

  const irisToHarvest = useQuery("irisToHarvest", async () => {
    const totalIrisToHarvest = [...farms, ...pools, ...balancers].reduce(async (_total, pool) => {
      const total = await _total;
      const irisEarned = await masterChef.pendingIris(pool.pid, account);
      return total.add(irisEarned);
    }, Promise.resolve(BigNumber.from(0)));

    return account ? utils.formatEther(await totalIrisToHarvest) : "0.00";
  });

  return { irisInWallet, irisToHarvest };
}

export function useIrisStats() {
  const irisContract = useIrisToken();
  const irisPrice = useIrisPrice();

  const irisStats = useQuery({
    enabled: !!irisPrice.data,
    refetchInterval: 0.5 * 60 * 1000,
    queryKey: ["irisStats", irisPrice.data],
    queryFn: async () => {
      const maximumSupply = 1_000_000;
      const totalMinted = (await irisContract.totalSupply()) as BigNumber;
      const totalBurned = (await irisContract.balanceOf(BurnAddress)) as BigNumber;

      const circulatingSupply = totalMinted.sub(totalBurned);

      let marketCap = "N/A";
      if (irisPrice) {
        // convert circulating supply to real price
        const circulatingSupplyInIris = utils.formatEther(circulatingSupply);
        marketCap = new BigNumberJS(circulatingSupplyInIris).multipliedBy(irisPrice.data).toString();
      }

      return {
        maximumSupply,
        marketCap,
        totalMinted: utils.formatEther(totalMinted),
        totalBurned: utils.formatEther(totalBurned),
        circulatingSupply: utils.formatEther(circulatingSupply),
      };
    },
  });

  return irisStats;
}

export function useFarmAPRStats() {
  const farmsResp = useFetchFarms();
  const isLoading = farmsResp.every((f) => f.status === "loading");

  const aprs = farmsResp.map((f) => (f.data as Farm)?.apr.yearlyAPR);
  const maxApr = Math.max(...aprs);

  return [isLoading, maxApr];
}

export function usePoolsAPRStats() {
  const poolsResp = useFetchPools();
  const isLoading = poolsResp.every((p) => p.status === "loading");

  const aprs = poolsResp.map((p) => (p.data as Pool)?.apr.yearlyAPR);
  const maxApr = Math.max(...aprs);

  return [isLoading, maxApr];
}

export function useTotalInVaults() {
  const vaultsResp = useFetchVaults();
  const isLoading = vaultsResp.every((f) => f.status === "loading");

  const data = vaultsResp.reduce((total, vaultResp) => {
    const vault = vaultResp.data as Vault;
    if (!vault) return new BigNumberJS(0);

    const totalLockedInVaults = new BigNumberJS(vault?.totalStaked).multipliedBy(vault?.stakeToken.price);

    return total.plus(totalLockedInVaults);
  }, new BigNumberJS(0));

  return {
    data,
    isLoading,
  };
}

export function useTotalInFarms() {
  const farmsResp = useFetchFarms();
  const isLoading = farmsResp.every((f) => f.status === "loading");

  const data = farmsResp.reduce((total, farmResp) => {
    const farm = farmResp.data as Farm;
    if (!farm) return new BigNumberJS(0);

    const totalLockedInFarm = new BigNumberJS(farm?.totalStaked).multipliedBy(farm?.stakeToken.price);

    return total.plus(totalLockedInFarm);
  }, new BigNumberJS(0));

  return {
    data,
    isLoading,
  };
}

export function useTotalInPools() {
  const poolsResp = useFetchPools();
  const isLoading = poolsResp.every((f) => f.status === "loading");

  const data = poolsResp.reduce((total, poolResp) => {
    const pool = poolResp.data as Pool;
    if (!pool) return new BigNumberJS(0);

    const totalLockedInFarm = new BigNumberJS(pool?.totalStaked).multipliedBy(pool?.stakeToken.price);

    return total.plus(totalLockedInFarm);
  }, new BigNumberJS(0));

  return {
    data,
    isLoading,
  };
}
export function useTotalInStakingPools() {
  const poolsResp = useFetchStakePools();
  const isLoading = poolsResp.every((f) => f.status === "loading");

  const data = poolsResp.reduce((total, poolResp) => {
    const pool = poolResp.data as StakeInfo;
    if (!pool) return new BigNumberJS(0);

    const totalLockedInFarm = new BigNumberJS(pool?.totalStaked).multipliedBy(pool?.stakeToken.price);

    return total.plus(totalLockedInFarm);
  }, new BigNumberJS(0));

  return {
    data,
    isLoading,
  };
}



export function useTotalInBalancers() {
  const balsResp = useFetchBalancers();
  const isLoading = balsResp.every((f) => f.status === "loading");

  const data = balsResp.reduce((total, balResp) => {
    const bal = balResp.data as Balancer;
    if (!bal) return new BigNumberJS(0);

    const totalLockedInFarm = new BigNumberJS(bal?.totalStaked).multipliedBy(bal?.stakeToken.price);

    return total.plus(totalLockedInFarm);
  }, new BigNumberJS(0));

  return {
    data,
    isLoading,
  };
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

export function useLandingPageStats() {
  return useQuery("landing-page-stats", async () => {
    const resp = await fetch("/api/stats");
    const data = await resp.json();

    const totalTvl = new BigNumberJS(data.iris?.tvl).plus(data.plutus?.tvl).toString();
    return {
      ...data,
      totalTvl,
    };
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
        [...farms, ...pools, ...balancers].map(async (pool) => {
          const lpContract = getLpContract(pool.stakeToken.address);
          const allowance: BigNumber = await lpContract.allowance(account, defaultContracts.masterChef.address);

          const hasApprovedPool = !allowance.isZero();

          if (!hasApprovedPool) return;

          const tx = await masterChef.deposit(pool.pid, utils.parseEther("0"), constants.AddressZero);
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

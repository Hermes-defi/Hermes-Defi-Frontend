import BigNumberJS from "bignumber.js";
import defaultContracts from "config/contracts";
import ReactGA from "react-ga";
import dayjs from "dayjs";

import { BurnAddress, DEFAULT_CHAIN_ID, irisPerBlock } from "config/constants";
import { farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { BigNumber, constants, utils } from "ethers";
import { useMasterChef, useIrisToken, useERC20, useUniPair } from "hooks/contracts";
import { useIrisPrice } from "hooks/prices";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { getPoolApr } from "web3-functions/utils";
import { Token } from "quickswap-sdk";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";

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
  const irisContract = useIrisToken();
  const { data: irisPrice } = useIrisPrice();

  const irisStats = useQuery(
    ["irisStats", irisPrice],
    async () => {
      const maximumSupply = 1_000_000;
      const totalMinted = (await irisContract.totalSupply()) as BigNumber;
      const totalBurned = (await irisContract.balanceOf(BurnAddress)) as BigNumber;

      const circulatingSupply = totalMinted.sub(totalBurned);

      let marketCap = "N/A";
      if (irisPrice) {
        // convert circulating supply to real price
        const circulatingSupplyInIris = utils.formatEther(circulatingSupply);
        marketCap = new BigNumberJS(circulatingSupplyInIris)
          .multipliedBy(irisPrice as string)
          .toString();
      }

      return {
        maximumSupply,
        marketCap,
        totalMinted: utils.formatEther(totalMinted),
        totalBurned: utils.formatEther(totalBurned),
        circulatingSupply: utils.formatEther(circulatingSupply),
      };
    },
    { enabled: !!irisPrice }
  );

  return irisStats;
}

export function useAPRStats() {
  const getLpContract = useERC20();
  const getPairContract = useUniPair();
  const masterChef = useMasterChef();
  const { library } = useActiveWeb3React();
  const { data: irisPrice } = useIrisPrice();

  const maxFarmAPR = useQuery(
    ["aprFarmStats", irisPrice],
    async () => {
      const aprsPromise = farmsDefaultData.map(async (pool) => {
        const lpContract = getLpContract(pool.lpAddress);
        const pairLpContract = getPairContract(pool.lpAddress);

        const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
        const totalSupply = utils.formatUnits(await pairLpContract.totalSupply(), pool.decimals);

        const token0 = new Token(
          DEFAULT_CHAIN_ID,
          pool.pairTokens[0].tokenAddress,
          pool.pairTokens[0].tokenDecimals,
          pool.pairTokens[0].tokenName
        );

        const token1 = new Token(
          DEFAULT_CHAIN_ID,
          pool.pairTokens[1].tokenAddress,
          pool.pairTokens[1].tokenDecimals,
          pool.pairTokens[1].tokenName
        );

        const tokenPrice = await fetchPairPrice(token0, token1, totalSupply, library);

        const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
        const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

        const poolRewardsPerWeek = new BigNumberJS(pool.multiplier)
          .div(totalAllocPoints)
          .times(rewardsPerWeek)
          .toNumber();

        // GET APY
        const apr = getPoolApr(
          parseFloat(irisPrice || "0"),
          poolRewardsPerWeek,
          parseFloat(tokenPrice || "0"),
          parseFloat(utils.formatUnits(totalLpStaked, pool.decimals) || "0")
        );

        return apr.yearlyAPR;
      });

      const aprs = await Promise.all(aprsPromise);
      const maxAPR = Math.max(...aprs);

      return maxAPR;
    },
    { enabled: !!irisPrice }
  );

  const maxPoolAPR = useQuery(
    ["aprPoolStats", irisPrice],
    async () => {
      const aprsPromise = poolDefaultData.map(async (pool) => {
        const lpContract = getLpContract(pool.lpAddress);
        const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);

        const token = new Token(DEFAULT_CHAIN_ID, pool.lpAddress, pool.decimals, pool.lpToken);
        const tokenPrice = await fetchPrice(token, library);

        const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
        const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

        const poolRewardsPerWeek = new BigNumberJS(pool.multiplier)
          .div(totalAllocPoints)
          .times(rewardsPerWeek)
          .toNumber();

        // GET APY
        const apr = getPoolApr(
          parseFloat(irisPrice || "0"),
          poolRewardsPerWeek,
          parseFloat(tokenPrice || "0"),
          parseFloat(utils.formatUnits(totalLpStaked, pool.decimals) || "0")
        );

        return apr.yearlyAPR;
      });

      const aprs = await Promise.all(aprsPromise);
      const maxAPR = Math.max(...aprs);

      return maxAPR;
    },
    { enabled: !!irisPrice }
  );

  return { maxFarmAPR, maxPoolAPR };
}

export function useHermesStats() {
  const getLpContract = useERC20();
  const getPairContract = useUniPair();
  const { library } = useActiveWeb3React();

  const hermesStats = useQuery("hermesStats", async () => {
    const totalValueInPools = await poolDefaultData.reduce(
      async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
        const lpContract = getLpContract(pool.lpAddress);

        const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
        const tokenDecimal = await lpContract.decimals();
        const tokenSymbol = await lpContract.symbol();

        const token = new Token(DEFAULT_CHAIN_ID, lpContract.address, tokenDecimal, tokenSymbol);
        const tokenPrice = await fetchPrice(token, library);

        const total = await _total;
        const poolPrice = new BigNumberJS(
          utils.formatUnits(totalLpStaked, tokenDecimal)
        ).multipliedBy(tokenPrice);

        return total.plus(poolPrice);
      },
      Promise.resolve(new BigNumberJS(0))
    );

    const totalValueInFarms = await farmsDefaultData.reduce(
      async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
        const lpContract = getPairContract(pool.lpAddress);

        const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
        const totalSupply = utils.formatUnits(await lpContract.totalSupply(), pool.decimals);

        const token0 = new Token(
          DEFAULT_CHAIN_ID,
          pool.pairTokens[0].tokenAddress,
          pool.pairTokens[0].tokenDecimals,
          pool.pairTokens[0].tokenName
        );

        const token1 = new Token(
          DEFAULT_CHAIN_ID,
          pool.pairTokens[1].tokenAddress,
          pool.pairTokens[1].tokenDecimals,
          pool.pairTokens[1].tokenName
        );

        const tokenPrice = await fetchPairPrice(token0, token1, totalSupply, library);

        const total = await _total;
        const poolPrice = new BigNumberJS(
          utils.formatUnits(totalLpStaked, pool.decimals)
        ).multipliedBy(tokenPrice);

        return total.plus(poolPrice);
      },
      Promise.resolve(new BigNumberJS(0))
    );

    const tvl = totalValueInPools.plus(totalValueInFarms);

    return {
      tvl: tvl.toString(),
      totalValueInFarms: totalValueInFarms.toString(),
      totalValueInPools: totalValueInPools.toString(),
    };
  });

  return hermesStats;
}

export function useTvlChart() {
  return useQuery("tvl-chart-data", async () => {
    // const resp = await fetch("https://bucketforhermes.s3.eu-central-1.amazonaws.com/chartData.json");
    // const data = await resp.json();

    // format data
    // const formattedData = data.map((tvlData: { value: string; time: string }) => {
    //   const time = dayjs(tvlData.time).format("HH:[00]");
    //   const value = parseInt(tvlData.value);

    //   return { time, value };
    // });

    return [
      { time: "00:00", value: 0 },
      { time: "01:00", value: 0 },
      { time: "02:00", value: 0 },
    ];
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
        [...farmsDefaultData, ...poolDefaultData].map(async (pool) => {
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

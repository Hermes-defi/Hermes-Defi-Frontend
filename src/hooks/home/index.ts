import BigNumberJS from "bignumber.js";
import defaultContracts from "config/contracts";
import ReactGA from "react-ga";
import { BurnAddress } from "config/constants";
import { farmIds, poolIds } from "config/pools";
import { BigNumber, Contract, utils } from "ethers";
import { useMasterChef, useIrisToken, useERC20 } from "hooks/contracts";
import { useIrisPrice, fetchPrice } from "hooks/prices";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { getPoolPublicData, harvestFromAll } from "web3-functions";
import { useToast } from "@chakra-ui/react";
import { getPoolApr } from "web3-functions/utils";

export function useIrisData() {
  const { account } = useActiveWeb3React();
  const masterChef = useMasterChef();
  const irisToken = useIrisToken();

  const irisInWallet = useQuery("irisInWallet", async () => {
    return account ? utils.formatEther(await irisToken.balanceOf(account)) : "0.00";
  });

  const irisToHarvest = useQuery("irisToHarvest", async () => {
    const totalIrisToHarvest = [
      // ...farmIds,
      ...poolIds,
    ].reduce(async (_total, pid) => {
      const total = await _total;
      const irisEarned = await masterChef.pendingIris(pid, account);
      return total.add(irisEarned);
    }, Promise.resolve(BigNumber.from(0)));

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
  const masterChef = useMasterChef();
  const { library } = useActiveWeb3React();
  const { data: irisPrice } = useIrisPrice();

  const maxPoolAPR = useQuery(
    ["aprStats", irisPrice],
    async () => {
      const aprsPromise = poolIds.map(async (pid) => {
        const { lpAddress } = await getPoolPublicData(pid, masterChef);
        const lpContract = getLpContract(lpAddress);

        const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
        const tokenDecimal = await lpContract.decimals();
        const tokenSymbol = await lpContract.symbol();
        const tokenPrice = await fetchPrice(lpContract.address, tokenDecimal, tokenSymbol, library);

        const apr = getPoolApr(
          parseFloat(tokenPrice),
          parseFloat(irisPrice) || 0,
          utils.formatUnits(totalLpStaked, tokenDecimal),
          0.4
        );

        return apr;
      });

      const aprs = await Promise.all(aprsPromise);
      const maxAPR = Math.max(...aprs);

      return maxAPR;
    },
    { enabled: !!irisPrice }
  );

  return { maxPoolAPR };
}

export function useHermesStats() {
  const getLpContract = useERC20();
  const masterChef = useMasterChef();
  const { library } = useActiveWeb3React();

  const hermesStats = useQuery("hermesStats", async () => {
    const farmLps = await Promise.all(
      []
      //   farmIds.map(async (pid) => {
      //     const { lpAddress } = await getPoolPublicData(pid, masterChef);
      //     return getLpContract(lpAddress);
      //   })
    );

    const poolLps = await Promise.all(
      poolIds.map(async (pid) => {
        const { lpAddress } = await getPoolPublicData(pid, masterChef);
        return getLpContract(lpAddress);
      })
    );

    const priceReducer = async (_total: Promise<BigNumberJS>, lpContract: Contract) => {
      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const tokenDecimal = await lpContract.decimals();
      const tokenSymbol = await lpContract.symbol();
      const tokenPrice = await fetchPrice(lpContract.address, tokenDecimal, tokenSymbol, library);

      const total = await _total;
      const poolPrice = new BigNumberJS(
        utils.formatUnits(totalLpStaked, tokenDecimal)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    };

    const totalValueInPools = await poolLps.reduce(
      priceReducer,
      Promise.resolve(new BigNumberJS(0))
    );

    const totalValueInFarms = await farmLps.reduce(
      priceReducer,
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

export function useHarvestAll(irisToHarvest: string) {
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const harvestAll = useMutation(() => harvestFromAll(masterChef), {
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
  });

  return harvestAll;
}

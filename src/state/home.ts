import ReactGA from "react-ga";
import { useToast } from "@chakra-ui/react";
import BigNumberJS from "bignumber.js";
import { BurnAddress } from "config/constants";
import { apolloContracts } from "config/contracts";
import { Farm } from "config/farms";
import { Pool } from "config/pools";
import { BigNumber, constants, utils } from "ethers";
import { useApolloToken, useERC20, useMasterChef } from "hooks/contracts";
import { useApolloPrice } from "hooks/prices";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useFetchFarms } from "./farms";
import { useFetchPools } from "./pools";

export function useAccountApolloData() {
  const { account } = useActiveWeb3React();
  const masterChef = useMasterChef();
  const apolloToken = useApolloToken();

  const apolloInWallet = useQuery("apolloInWallet", async () => {
    return account ? utils.formatEther(await apolloToken.balanceOf(account)) : "0.00";
  });

  const apolloToHarvest = useQuery("apolloToHarvest", async () => {
    const totalIrisToHarvest = [].reduce(async (_total, pool) => {
      const total = await _total;
      const irisEarned = await masterChef.pendingIris(pool.pid, account);
      return total.plus(irisEarned);
    }, Promise.resolve(new BigNumberJS(0)));

    return account ? utils.formatEther(await totalIrisToHarvest) : "0.00";
  });

  return { apolloInWallet, apolloToHarvest };
}

export function useApolloStats() {
  const apolloContract = useApolloToken();
  const apolloPrice = useApolloPrice();

  const apolloStats = useQuery({
    enabled: !!apolloPrice.data,
    refetchInterval: 0.5 * 60 * 1000,
    queryKey: ["apolloStats", apolloPrice.data],
    queryFn: async () => {
      const maximumSupply = 1_000_000;
      const totalMinted = (await apolloContract.totalSupply()) as BigNumber;
      const totalBurned = (await apolloContract.balanceOf(BurnAddress)) as BigNumber;

      const circulatingSupply = totalMinted.sub(totalBurned);

      let marketCap = "N/A";
      if (apolloPrice) {
        // convert circulating supply to real price
        const circulatingSupplyInIris = utils.formatEther(circulatingSupply);
        marketCap = new BigNumberJS(circulatingSupplyInIris).multipliedBy(apolloPrice.data).toString();
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

  return apolloStats;
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

export function useHarvestAll(irisToHarvest: string) {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const toast = useToast();

  const harvestAll = useMutation(
    async () => {
      return Promise.all(
        [].map(async (pool) => {
          const lpContract = getLpContract(pool.stakeToken.address);
          const allowance: BigNumber = await lpContract.allowance(account, apolloContracts.masterChef.address);

          const hasApprovedPool = !allowance.isZero();

          if (!hasApprovedPool) return;

          const tx = await masterChef.deposit(pool.pid, utils.parseEther("0"), constants.AddressZero);
          await tx.wait();
        })
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("apolloInWallet");
        queryClient.invalidateQueries("apolloToHarvest");

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
          title: "Error harvesting APOLLO",
          description: data?.message || message,
          isClosable: true,
        });
      },
    }
  );

  return harvestAll;
}

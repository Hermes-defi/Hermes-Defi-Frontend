import defaultContracts from "config/contracts";
import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { fetchPrice } from "web3-functions/prices";

export function useIrisPrice() {
  const { library } = useActiveWeb3React();

  return useQuery({
    queryKey: "iris-price",
    queryFn: async () => {
      return await fetchPrice({ address: defaultContracts.irisToken.address, decimals: 18, symbol: "IRIS" }, library);
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function useApolloPrice() {
  const { library } = useActiveWeb3React();

  return useQuery({
    queryKey: "apollo-price",
    queryFn: async () => {
      return await fetchPrice(
        { address: defaultContracts.apolloToken.address, decimals: 18, symbol: "APOLLO" },
        library
      );
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

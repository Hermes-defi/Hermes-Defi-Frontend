import defaultContracts from "config/contracts";
import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { fetchPrice } from "web3-functions/prices";

export function usePlutusPrice() {
  const { library } = useActiveWeb3React();

  return useQuery({
    queryKey: "plutus-price",
    queryFn: async () => {
      return await fetchPrice({ address: defaultContracts.plutusToken.address, decimals: 18, symbol: "PLUTUS" }, library);
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

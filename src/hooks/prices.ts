import defaultContracts from "config/contracts";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { Token } from "quickswap-sdk";
import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { fetchPrice } from "web3-functions/prices";

export function useIrisPrice() {
  const { library } = useActiveWeb3React();

  return useQuery({
    queryKey: "iris-price",
    queryFn: async () => {
      const token = new Token(DEFAULT_CHAIN_ID, defaultContracts.irisToken.address, 18, "IRIS");
      return await fetchPrice(token, library);
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

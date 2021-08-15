import defaultContracts from "config/contracts";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { Token } from "quickswap-sdk";
import { useActiveWeb3React } from "wallet";
import { useQuery, UseQueryOptions } from "react-query";
import { fetchPrice, fetchPairPrice } from "web3-functions/prices";

export function useTokenPrice(
  tokenAddress: string,
  decimals = 18,
  symbol?: string,
  options: UseQueryOptions<any> = {}
) {
  const { library } = useActiveWeb3React();

  return useQuery<string>(
    ["token-price", tokenAddress, decimals],
    async () => {
      const token = new Token(DEFAULT_CHAIN_ID, tokenAddress, decimals, symbol);
      return await fetchPrice(token, library);
    },
    options
  );
}

export function useLpPrice(
  tokenO: { tokenAddress: string; decimals: number; symbol?: string },
  token1: { tokenAddress: string; decimals: number; symbol?: string },
  totalSupply: string,
  options: UseQueryOptions<any> = {}
) {
  const { library } = useActiveWeb3React();

  return useQuery<string>(
    ["token-price", tokenO.tokenAddress, token1.tokenAddress],
    async () => {
      const t0 = new Token(DEFAULT_CHAIN_ID, tokenO.tokenAddress, tokenO.decimals, tokenO.symbol);
      const t1 = new Token(DEFAULT_CHAIN_ID, token1.tokenAddress, token1.decimals, token1.symbol);
      return await fetchPairPrice(t0, t1, totalSupply, library);
    },
    options
  );
}

export function useIrisPrice() {
  return useTokenPrice(defaultContracts.irisToken.address, 18, "IRIS");
}

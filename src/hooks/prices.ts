import defaultTokens from "config/tokens";
import defaultContracts from "config/contracts";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { Token, WETH as WMATIC, Fetcher, Route } from "quickswap-sdk";
import { useActiveWeb3React } from "wallet";
import { useQuery, UseQueryOptions } from "react-query";

export async function fetchPrice(
  tokenAddress: string,
  tokenDecimal: number,
  tokenSymbol: string,
  library: any
) {
  const usdc = new Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.usdc.address,
    defaultTokens.usdc.decimals,
    "USDC"
  );
  const token = new Token(DEFAULT_CHAIN_ID, tokenAddress, tokenDecimal, tokenSymbol);

  try {
    let route;
    if (token.symbol !== "WMATIC") {
      // fetch matic to usdc pair
      const MaticToUSDCPair = await Fetcher.fetchPairData(WMATIC[DEFAULT_CHAIN_ID], usdc, library);

      // fetch the token to matic pair info
      const tokenToMatic = await Fetcher.fetchPairData(token, WMATIC[DEFAULT_CHAIN_ID], library);

      // find a route
      route = new Route([MaticToUSDCPair, tokenToMatic], usdc);
    } else {
      // use only the MATIC-USDC pair to get the price
      const pair = await Fetcher.fetchPairData(token, usdc, library);
      route = new Route([pair], usdc);
    }

    // const trade = new Trade(
    //   route,
    //   new TokenAmount(usdc, utils.parseUnits("1", 6).toString()),
    //   TradeType.EXACT_INPUT
    // );

    // console.log({
    //   tokenSymbol: tokenSymbol,
    //   price: route.midPrice.toSignificant(6),
    //   priceInvert: route.midPrice.invert().toSignificant(6),
    // });

    return route.midPrice.invert().toSignificant(6);
  } catch (e) {
    console.log("error getting price", e.message, { tokenSymbol, tokenAddress });
    if (e.message.includes("ADDRESSES")) {
      return "1";
    }

    return "0";
  }
}

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
      return await fetchPrice(tokenAddress, decimals, symbol, library);
    },
    options
  );
}

export function useIrisPrice() {
  return useTokenPrice(defaultContracts.irisToken.address, 18, "IRIS");
}

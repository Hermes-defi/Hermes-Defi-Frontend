import defaultTokens from "config/tokens";
import BigNumberJS from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { Token, WETH as WMATIC, Fetcher, Route } from "quickswap-sdk";

export async function fetchPrice(token: Token, library: any) {
  const usdc = new Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.usdc.address,
    defaultTokens.usdc.decimals,
    "USDC"
  );

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
    console.log(`error getting price for ${token.symbol}`, e.message, token);

    // TODO:: on production the error throw is only the prefix, if we start getting faulty prices,
    // please refactor
    // HACK:: we use this for cases where the we're finding a route for a token to the same token,
    // so we hack the price to be 1 because TOKEN_A_PRICE === TOKEN_A_PRICE (same token!!!)
    if (e.message.includes("ADDRESSES")) {
      return "1";
    }

    return "0";
  }
}

export async function fetchPairPrice(
  token0: Token,
  token1: Token,
  totalSupply: string,
  library: any
) {
  // price of an lp token is [ totalValueOrLP / tokenSupplyOfLPToken ]
  const token0Price = await fetchPrice(token0, library);
  const token1Price = await fetchPrice(token1, library);

  const pair = await Fetcher.fetchPairData(token0, token1, library);
  const reserve0 = pair.reserve0.toExact(); // no need for decimals formatting
  const reserve1 = pair.reserve1.toExact(); // no need for decimals formatting

  const token0Total = new BigNumberJS(reserve0).times(new BigNumberJS(token0Price));
  const token1Total = new BigNumberJS(reserve1).times(new BigNumberJS(token1Price));

  const tvl = token0Total.plus(token1Total);
  const price = tvl.dividedBy(new BigNumberJS(totalSupply));

  return price.toString();
}

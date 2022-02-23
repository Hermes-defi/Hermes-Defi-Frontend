import fetch from "isomorphic-fetch";
import defaultTokens from "config/tokens";
import BigNumberJS, { BigNumber } from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { Fetcher, Route, Token, WETH as WMATIC } from "quickswap-sdk";
import * as Dfyn from "@dfyn/sdk";
import * as Sushi from "@sushiswap/sdk";
import * as Viper from "@venomswap/sdk";
import defaultContracts from "config/contracts";
import { Contract, ethers, utils } from "ethers";

const amms = {
  "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3": "viper", //PLTS
  "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a": "viper", //WONE
  "0xef977d2f931c1978db5f6747666fa1eacb0d0339": "viper", //1DAI
  "0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79": "viper", //VIPER
  "0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc": "viper", //1IRIS
  "0xbb948620fa9cd554ef9a331b13edea9b181f9d45": "viper", //wsWAGMI
  "0xe064a68994e9380250cfee3e8c0e2ac5c0924548": "viper", //xVIPER
  "0xd3a50c0dce15c12fe64941ffd2b864e887c9b9e1": "viper", //HARMONAPE
  "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F": "dfk", //JEWEL
  "0xfe1b516A7297eb03229A8B5AfAD80703911E81cB": "viper", //ROY

  "0x6983d1e6def3690c4d616b13597a09e6193ea013": "sushiswap", //1ETH
  "0x3095c7557bcb296ccc6e363de01b760ba031f2d9": "sushiswap", //1WBTC
  "0xdc54046c0451f9269fee1840aec808d36015697d": "sushiswap", //1BTC
  "0xfa7191d292d5633f702b0bd7e3e3bccc0e633200": "sushiswap", //FRAX
  "0xeb6c08ccb4421b6088e581ce04fcfbed15893ac3": "sushiswap", //1FRAX
  "0x985458e523db3d53125813ed68c274899e9dfab4": "sushiswap", //1USDC
  "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f": "sushiswap", //1USDT
  "0x22d62b19b7039333ad773b7185bb61294f3adc19": "sushiswap", //stONE
  "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a": "sushiswap", //1SUSHI
  "0x0ab43550a6915f9f67d0c454c2e90385e6497eaa": "sushiswap", //bscBUSD
  "0xe176ebe47d621b984a73036b9da5d834411ef734": "sushiswap", //BUSD
  "0x224e64ec1bdce3870a6a6c777edd450454068fec": "sushiswap", //UST

  "0xda7fe71960cd1c19e1b86d6929efd36058f60a03": "coingecko", //LUMEN
  "0x90d81749da8867962c760414c1c25ec926e889b6": "coingecko", //1UNI
  "0x6008c8769bfacd92251ba838382e7e5637c7e74d": "coingecko", //COSMIC
  "0x892d81221484f690c0a97d3dd18b9144a3ecdfb7": "viper", //MAGIC

  "0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f": "dfk", //JEWEL/ONE
  "0x8D760497554eecC3B9036fb0364156ef2F0D02BC": "dfk", //HLY
};

async function fetchCoinGeckoPrice(address: string) {
  try {
    const resp = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/harmony-shard-0?contract_addresses=${address}&vs_currencies=usd`
    );

    const data = await resp.json();
    return data[address.toLowerCase()].usd || "0";
  } catch (err) {
    return "0";
  }
}

async function fetchQuickSwapPrice(
  _token: { address: string; decimals: number; symbol: string },
  library: any
) {
  const usdc = new Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.usdc.address,
    defaultTokens.usdc.decimals,
    "USDC"
  );

  const token = new Token(
    DEFAULT_CHAIN_ID,
    _token.address,
    _token.decimals,
    _token.symbol
  );

  try {
    let route;
    if (token.symbol !== "WMATIC") {
      // fetch matic to usdc pair
      const MaticToUSDCPair = await Fetcher.fetchPairData(
        WMATIC[DEFAULT_CHAIN_ID],
        usdc,
        library
      );

      // fetch the token to matic pair info
      const tokenToMatic = await Fetcher.fetchPairData(
        token,
        WMATIC[DEFAULT_CHAIN_ID],
        library
      );

      // find a route
      route = new Route([MaticToUSDCPair, tokenToMatic], usdc);
    } else {
      // use only the MATIC-USDC pair to get the price
      const pair = await Fetcher.fetchPairData(token, usdc, library);
      route = new Route([pair], usdc);
    }
    return route.midPrice.invert().toSignificant(6);
  } catch (e) {
    console.log("Error for token", token);
    // console.log(`error getting price for ${token.symbol}`, e.message, token);

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

async function fetchDfynPrice(
  _token: { address: string; decimals: number; symbol: string },
  library: any
) {
  const token = new Dfyn.Token(
    DEFAULT_CHAIN_ID,
    _token.address,
    _token.decimals,
    _token.symbol
  );

  const usdc = new Dfyn.Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.usdc.address,
    defaultTokens.usdc.decimals,
    "USDC"
  );
  const iron = new Dfyn.Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.iron.address,
    defaultTokens.iron.decimals,
    "IRON"
  );

  try {
    let route;
    if (token.symbol !== "WMATIC") {
      // fetch matic to usdc pair
      const MaticToUSDCPair = await Dfyn.Fetcher.fetchPairData(
        Dfyn.WETH[DEFAULT_CHAIN_ID], // points to WMATIC :facepalm:
        usdc,
        library
      );

      // fetch the token to matic pair info
      const tokenToMatic = await Dfyn.Fetcher.fetchPairData(
        token,
        Dfyn.WETH[DEFAULT_CHAIN_ID],
        library
      );

      // find a route
      route = new Dfyn.Route([MaticToUSDCPair, tokenToMatic], usdc);
    } else {
      // use only the MATIC-USDC pair to get the price
      const pair = await Dfyn.Fetcher.fetchPairData(token, usdc, library);
      route = new Dfyn.Route([pair], usdc);
    }

    return route.midPrice.invert().toSignificant(6);
  } catch (e) {
    console.log(
      `dfyn - error getting price for ${token.symbol}`,
      e.message,
      token
    );

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

async function fetchPolycatPrice(address: string) {
  try {
    const resp = await fetch(
      "https://api.thegraph.com/subgraphs/name/polycatfi/polycat-finance-amm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            tokenDayDatas ( 
              orderBy: date,
              orderDirection: desc,
              where: { 
                token: "${address.toLowerCase()}" 
              } 
            ){
              id
              date
              priceUSD
            }
          }`,
        }),
      }
    );

    const { data } = await resp.json();
    return new BigNumberJS(data.tokenDayDatas[0].priceUSD)
      .toPrecision(6)
      .toString();
  } catch (err) {
    console.log(err);
    return "0";
  }
}

async function fetchSushiswapPrice(address: string) {
  try {
    const resp = await fetch(
      "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            tokenDayDatas ( 
              orderBy: date
              orderDirection: desc
              where: { 
                token: "${address.toLowerCase()}" 
              } 
            ){
              id
              date
              priceUSD
            }
          }`,
        }),
      }
    );

    const { data } = await resp.json();
    return new BigNumberJS(data.tokenDayDatas[0]?.priceUSD)
      .toPrecision(6)
      .toString();
  } catch (err) {
    console.log(err);
    return "0";
  }
}

async function fetchSushiPairData(token: string) {
  return fetch(
    "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
        pair(id: "${token}"){
          token0{
            id
            name
            symbol
          }
          token1{
            id
            name
            symbol
          }
          reserve0
          reserve1
        }
        }`,
      }),
    }
  )
    .then(function (response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then((jsonResponse) => {
      return jsonResponse.data || {};
    });
}

async function fetchSushiSwapPrice2(
  address: string,
  decimals: number,
  symbol: string
) {
  const woneAddress = "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a";
  const usdcAddress = "0x985458E523dB3d53125813eD68c274899e9DfAb4";

  const tokenWONE = new Sushi.Token(
    DEFAULT_CHAIN_ID,
    woneAddress.toLowerCase(),
    18,
    "WONE"
  );

  const tokenUSDC = new Sushi.Token(
    DEFAULT_CHAIN_ID,
    usdcAddress.toLowerCase(),
    6,
    "USDC"
  );

  const token = new Sushi.Token(
    DEFAULT_CHAIN_ID,
    address.toLowerCase(),
    decimals,
    symbol
  );

  // console.debug({
  //   woneUsdcPairAddress,
  //   woneUsdcPairData,
  //   woneTokenPairAddress,
  //   woneTokenPairData,
  // });

  try {
    let route;
    // fetch one to usdc pair
    const woneUsdcPairAddress = Sushi.Pair.getAddress(
      tokenWONE,
      tokenUSDC
    ).toLowerCase();
    const woneUsdcPairData = await fetchSushiPairData(woneUsdcPairAddress);

    const WoneToUsdcPair = new Sushi.Pair(
      Sushi.CurrencyAmount.fromRawAmount(
        tokenWONE,
        Math.round(Number(woneUsdcPairData.pair.reserve1)).toString()
      ),
      Sushi.CurrencyAmount.fromRawAmount(
        tokenUSDC,
        Math.round(Number(woneUsdcPairData.pair.reserve0)).toString()
      )
    );
    if (token.symbol !== "WONE") {
      const woneTokenPairAddress = Sushi.Pair.getAddress(
        tokenWONE,
        token
      ).toLowerCase();
      const woneTokenPairData = await fetchSushiPairData(woneTokenPairAddress);
      const TokenToWonePair = new Sushi.Pair(
        Sushi.CurrencyAmount.fromRawAmount(
          token,
          Math.round(Number(woneTokenPairData.pair.reserve1)).toString()
        ),
        Sushi.CurrencyAmount.fromRawAmount(
          tokenWONE,
          Math.round(Number(woneTokenPairData.pair.reserve0)).toString()
        )
      );

      route = new Sushi.Route(
        [TokenToWonePair, WoneToUsdcPair],
        token,
        tokenWONE
      );
      return route.midPrice.toSignificant(6);
    } else {
      route = new Sushi.Route([WoneToUsdcPair], token, tokenUSDC);
      return route.midPrice.invert().toSignificant(6);
    }
  } catch (e) {
    console.error("sushiswap - error getting price for", token, e);

    return "0";
  }
}

async function fetchViperSwapPrice(
  _token: { address: string; decimals: number; symbol: string },
  library: any
) {
  try {
    const resp = await fetch(
        "https://graph.viper.exchange/subgraphs/name/venomprotocol/venomswap-v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `{
            tokenDayDatas ( 
              where: { 
                token: "${_token.address.toLowerCase()}" 
              } 
            ){
              id
              date
              priceUSD
            }
          }`,
          }),
        }
    );

    const { data } = await resp.json();
    return new BigNumberJS( data.tokenDayDatas[0]?.priceUSD ).toPrecision(6).toString();
  } catch (err) {
    console.log(err);
    return "0";
  }
}

async function fetchViperSwapPrice2(
  _token: { address: string; decimals: number; symbol: string },
  library: any
) {
  const usdc = new Viper.Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.usdc.address,
    defaultTokens.usdc.decimals,
    "1USDC"
  );

  const wone = new Viper.Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.wone.address,
    defaultTokens.wone.decimals,
    "WONE"
  )

  const dai = new Viper.Token(
    DEFAULT_CHAIN_ID,
    defaultTokens.dai.address,
    defaultTokens.dai.decimals,
    "1DAI"
  )

  const token = new Viper.Token(
    DEFAULT_CHAIN_ID,
    _token.address,
    _token.decimals,
    _token.symbol
  );

  try {
    let route;
    if(token.symbol === "PLTS"){
      // TODO: delete this return 
      // ! ONLY 4 PRESALE
      // return new BigNumberJS(0.1515);
      // fetch dai to usdc pair
      const DAIToUSDCPair = await Viper.Fetcher.fetchPairData(
        dai,
        usdc,
        library
      );

      // fetch plutus to dai pair info
      const tokenToDAI = await Viper.Fetcher.fetchPairData(
        token,
        dai,
        library
      );

      // find a route
      route = new Viper.Route([DAIToUSDCPair, tokenToDAI], usdc);
    }
    else if (token.symbol !== "WONE") {
      // fetch wone to usdc pair
      const WONEToUSDCPair = await Viper.Fetcher.fetchPairData(
        wone,
        usdc,
        library
      );

      // fetch the token to wone pair info
      const tokenToWONE = await Viper.Fetcher.fetchPairData(
        token,
        wone,
        library
      );
      
      // find a route
      route = new Viper.Route([WONEToUSDCPair, tokenToWONE], usdc, token);
      
    } else {
      // use only the WONE-USDC pair to get the price
      const pair = await Viper.Fetcher.fetchPairData(token, usdc, library);
      route = new Viper.Route([pair], usdc);
    }

    // console.log("TOKEN: ", token.symbol, " PRICE: ", route.midPrice.invert().toSignificant(10));
    return route.midPrice.invert().toSignificant(6);
  } catch (e) {
    console.log("Error for token", token);
    // console.log(`error getting price for ${token.symbol}`, e.message, token);

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


async function fetchDFKPrice(
  address: string,
  decimals: number,
  library: any,
) {
  try {
    console.log(address)
    const lp = {
      "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F": "0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f",
      "0x8D760497554eecC3B9036fb0364156ef2F0D02BC": "0x3e478ED607F79A50f286A5A6ce52A049897291B2"
    };
    const contractAddress = defaultContracts.dfkOracle.address;
    console.log("🚀 ~ file: prices.ts ~ line 532 ~ contractAddress", contractAddress)
    const abi = defaultContracts.dfkOracle.abi;

    // const oracleContract = useDFKOracleContract();
    const oracle = new Contract(contractAddress, abi, library);
    const tokenPriceWei = await oracle.getLatestTokenPrice(lp[address], 1);
    console.log("🚀 ~ file: prices.ts ~ line 532 ~ tokenPriceWei", (tokenPriceWei /1e18).toString())
    const onePrice = await oracle.getLatestONEPrice() / 1e8;
    const tokenPrice = (onePrice / (tokenPriceWei / 1e18)).toFixed(5)
    console.log("🚀 ~ file: prices.ts ~ line 533 ~ onePriceWei", onePrice.toString())
    console.log("🚀 ~ file: prices.ts ~ line 534 ~ tokenPrice", tokenPrice)
    return tokenPrice;
  } catch (e) {
    console.error("dfk - error getting price for DFKLP", e);

    return "0";
  }
}

export async function fetchPrice(
  token: { address: string; decimals: number; symbol: string },
  library: any
) {
  const ammsFetcher = {
    coingecko: (t: { address: string; decimals: number; symbol: string }) =>
      fetchCoinGeckoPrice(t.address),
    quickswap: (t: { address: string; decimals: number; symbol: string }) =>
      fetchQuickSwapPrice(t, library),
    dfyn: (t: { address: string; decimals: number; symbol: string }) =>
      fetchDfynPrice(t, library),
    polycat: (t: { address: string; decimals: number; symbol: string }) =>
      fetchPolycatPrice(t.address),
    sushiswap: (t: { address: string; decimals: number; symbol: string }) =>
      fetchSushiswapPrice(t.address),
    viper: (t: { address: string; decimals: number; symbol: string }) =>
      fetchViperSwapPrice2(t, library),
    dfk: (t: { address: string; decimals: number; symbol: string }) =>
      fetchDFKPrice(t.address, t.decimals, library),
  };


  try {
    const tokenAddress = token.address.toLowerCase();

    const ammEntry = Object.entries(amms).find(
      ([k]) => k.toLowerCase() === tokenAddress
    );
    if (!ammEntry) {
      console.warn("Could not find AMM for token", tokenAddress);
      return 0;
    }

    const amm = ammEntry[1];
    const price = await ammsFetcher[amm](token);
    return price;
  } catch (e) {
    console.log(e);
    return "0";
  }
}

export async function fetchPairPrice(
  token0: { address: string; decimals: number; symbol: string },
  token1: { address: string; decimals: number; symbol: string },
  totalSupply: string,
  library: any,
  amm?: any
) {
  const token0Price = await fetchPrice(token0, library);
  const token1Price = await fetchPrice(token1, library);

  const getPrice = {
    quickswap: async () => {
      const t0 = new Token(
        DEFAULT_CHAIN_ID,
        token0.address,
        token0.decimals,
        token0.symbol
      );
      const t1 = new Token(
        DEFAULT_CHAIN_ID,
        token1.address,
        token1.decimals,
        token1.symbol
      );

      const pair = await Fetcher.fetchPairData(t0, t1, library);

      const reserve0 = pair.reserve0.toExact(); // no need for decimals formatting
      const reserve1 = pair.reserve1.toExact(); // no need for decimals formatting

      const token0Total = new BigNumberJS(reserve0).times(
        new BigNumberJS(token0Price)
      );
      const token1Total = new BigNumberJS(reserve1).times(
        new BigNumberJS(token1Price)
      );

      const tvl = token0Total.plus(token1Total);
      const price = tvl.dividedBy(new BigNumberJS(totalSupply));

      return price.toString();
    },

    dfyn: async () => {
      const t0 = new Dfyn.Token(
        DEFAULT_CHAIN_ID,
        token0.address,
        token0.decimals,
        token0.symbol
      );
      const t1 = new Dfyn.Token(
        DEFAULT_CHAIN_ID,
        token1.address,
        token1.decimals,
        token1.symbol
      );

      const pair = await Dfyn.Fetcher.fetchPairData(t0, t1, library);

      const reserve0 = pair.reserve0.toExact(); // no need for decimals formatting
      const reserve1 = pair.reserve1.toExact(); // no need for decimals formatting

      const token0Total = new BigNumberJS(reserve0).times(
        new BigNumberJS(token0Price)
      );
      const token1Total = new BigNumberJS(reserve1).times(
        new BigNumberJS(token1Price)
      );

      const tvl = token0Total.plus(token1Total);
      const price = tvl.dividedBy(new BigNumberJS(totalSupply));

      return price.toString();
    },

    polycat: async () => {
      try {
        const resp = await fetch(
          "https://api.thegraph.com/subgraphs/name/polycatfi/polycat-finance-amm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `{
                pairs (where: { token0: "${token0.address.toLowerCase()}", token1: "${token1.address.toLowerCase()}"}) {
                  id
                  reserve0
                  reserve1
                }
              }`,
            }),
          }
        );

        const { data } = await resp.json();

        const token0Total = new BigNumberJS(data.pairs[0].reserve0).times(
          new BigNumberJS(token0Price)
        );

        const token1Total = new BigNumberJS(data.pairs[0].reserve1).times(
          new BigNumberJS(token1Price)
        );

        const tvl = token0Total.plus(token1Total);
        const price = tvl.dividedBy(new BigNumberJS(totalSupply));

        return price.toString();
      } catch (err) {
        console.log(err);
        return "0";
      }
    },

    sushiswap: async () => {
      const t0 = new Sushi.Token(
        DEFAULT_CHAIN_ID,
        token0.address,
        token0.decimals,
        token0.symbol
      );
      const t1 = new Sushi.Token(
        DEFAULT_CHAIN_ID,
        token1.address,
        token1.decimals,
        token1.symbol
      );
      const pairAddress = Sushi.Pair.getAddress(
        t0,
        t1
      ).toLowerCase()
      const pair = await fetchSushiPairData(pairAddress);

      const reserve0 = Math.round(Number(pair.pair.reserve0)); // no need for decimals formatting
      const reserve1 = Math.round(Number(pair.pair.reserve1)); // no need for decimals formatting

      const token0Total = new BigNumberJS(reserve0).times(
        new BigNumberJS(token0Price)
      );
      const token1Total = new BigNumberJS(reserve1).times(
        new BigNumberJS(token1Price)
      );
      

      const tvl = token0Total.plus(token1Total);
      
      const price = tvl.dividedBy(new BigNumberJS(totalSupply));

      // console.log("------------LP: ", t0.symbol, "/", t1.symbol, "------------------")
      // console.log("🚀 ~ file: prices.ts ~ line 741 ~ viperswap: ~ reserve0", reserve0)
      // console.log("🚀 ~ file: prices.ts ~ line 743 ~ viperswap: ~ reserve1", reserve1)
      // console.log("🚀 ~ file: prices.ts ~ line 747 ~ viperswap: ~ token0Price", token0Price)
      // console.log("🚀 ~ file: prices.ts ~ line 750 ~ viperswap: ~ token1Price", token1Price)
      // console.log("🚀 ~ file: prices.ts ~ line 756 ~ viperswap: ~ token0Total", token0Total.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 756 ~ viperswap: ~ token1Total", token1Total.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 761 ~ viperswap: ~ totalSupply", totalSupply)
      // console.log("🚀 ~ file: prices.ts ~ line 758 ~ viperswap: ~ tvl", tvl.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 761 ~ viperswap: ~ price", price.toString())

      return price.toString();

    },
    viperswap: async () => {
      const t0 = new Viper.Token(
        DEFAULT_CHAIN_ID,
        token0.address,
        token0.decimals,
        token0.symbol
      );
      const t1 = new Viper.Token(
        DEFAULT_CHAIN_ID,
        token1.address,
        token1.decimals,
        token1.symbol
      );

      const pair = await Viper.Fetcher.fetchPairData(t0, t1, library);

      const reserve0 = pair.reserve0.toExact(); // no need for decimals formatting
      const reserve1 = pair.reserve1.toExact(); // no need for decimals formatting

      const token0Total = new BigNumberJS(reserve0).times(
        new BigNumberJS(token0Price)
      );
      const token1Total = new BigNumberJS(reserve1).times(
        new BigNumberJS(token1Price)
      );
      

      const tvl = token0Total.plus(token1Total);
      
      const price = tvl.dividedBy(new BigNumberJS(totalSupply));

      // console.log("------------LP: ", t0.symbol, "/", t1.symbol, "------------------")
      // console.log("🚀 ~ file: prices.ts ~ line 741 ~ viperswap: ~ reserve0", reserve0)
      // console.log("🚀 ~ file: prices.ts ~ line 743 ~ viperswap: ~ reserve1", reserve1)
      // console.log("🚀 ~ file: prices.ts ~ line 747 ~ viperswap: ~ token0Price", token0Price)
      // console.log("🚀 ~ file: prices.ts ~ line 750 ~ viperswap: ~ token1Price", token1Price)
      // console.log("🚀 ~ file: prices.ts ~ line 756 ~ viperswap: ~ token0Total", token0Total.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 756 ~ viperswap: ~ token1Total", token1Total.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 761 ~ viperswap: ~ totalSupply", totalSupply)
      // console.log("🚀 ~ file: prices.ts ~ line 758 ~ viperswap: ~ tvl", tvl.toString())
      // console.log("🚀 ~ file: prices.ts ~ line 761 ~ viperswap: ~ price", price.toString())

      return price.toString();
    },
  }[amm];

  return await getPrice();
}

export async function fetchBalancerPrice(balancerId: string) {
  try {
    const resp = await fetch(
      "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{    
              pool(id: "${balancerId}" ) {
                id
                totalLiquidity
                totalShares
              }
          }`,
        }),
      }
    );

    const { data } = await resp.json();

    const totalLiqidity = new BigNumberJS(data.pool.totalLiquidity);
    const totalShares = new BigNumberJS(data.pool.totalShares);

    return totalLiqidity.dividedBy(totalShares).toString();
  } catch (e) {
    console.log(e);
    return "0";
  }
}

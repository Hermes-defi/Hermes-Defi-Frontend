import defaultContracts from "config/contracts";
import defaultTokens from "config/tokens";
import { BigNumber, utils } from "ethers";
import {
  Token,
  WETH as WMATIC,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
} from "quickswap-sdk";
import { farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { DEFAULT_CHAIN_ID } from "config/constants";

import { useQuery, UseQueryOptions } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef } from "./contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";

async function fetchPrice(
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
}

export function useTokenPrice(
  tokenAddress: string,
  decimals = 18,
  symbol?: string,
  options: UseQueryOptions = {}
) {
  const { library } = useActiveWeb3React();

  return useQuery(
    ["token-price", tokenAddress, decimals],
    async () => {
      let price;

      try {
        price = await fetchPrice(tokenAddress, decimals, symbol, library);
      } catch (e) {
        console.log("error getting price", { symbol, tokenAddress }, e.message);

        if (e.message.includes("ADDRESSES")) {
          price = "1";
        }

        price = "0";
      }

      return price;
    },
    options
  );
}

export function useFetchPoolData() {
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const { account, library } = useActiveWeb3React();

  const defaultData = [...farmsDefaultData, ...poolDefaultData];
  const fetchData = useCallback(
    async (pid: number) => {
      let poolInfo;
      try {
        poolInfo = await masterChef.poolInfo(pid);
      } catch (e) {
        //  if we can't fetch pool data then use the default data
        return defaultData.find((d) => d.pid === pid);
      }

      // PUBLIC DATA
      const multiplier = poolInfo.allocPoint.toString();
      const active = multiplier !== "0";
      const depositFees = BigNumber.from(poolInfo.depositFeeBP).div(100).toNumber();
      const lpAddress = poolInfo.lpToken;

      // TOKEN DATA
      const lpContract = getLpContract(lpAddress);
      const symbol = await lpContract.symbol();
      const decimals = await lpContract.decimals();
      const totalStaked = utils.formatUnits(
        await lpContract.balanceOf(defaultContracts.masterChef.address),
        decimals
      );

      // TOKEN PRICE
      let price;

      try {
        price = await fetchPrice(lpAddress, decimals, symbol, library);
      } catch (e) {
        console.log("error getting price", { symbol, lpAddress }, e.message);

        if (e.message.includes("ADDRESSES")) {
          price = "1";
        }

        price = "0";
      }

      // GET APY
      const apr = getPoolApr(price, 0, totalStaked, 0.4);

      // USER DATA
      let userData = {
        hasStaked: false,
        hasApprovedPool: false,
        irisEarned: "0",
        lpStaked: "0",
      };

      if (account) {
        const irisEarned = utils.formatEther(await masterChef.pendingIris(pid, account));
        const userInfo = await masterChef.userInfo(pid, account);

        const lpStaked = utils.formatUnits(userInfo.amount, decimals);
        const hasStaked = !(userInfo.amount as BigNumber).isZero();

        const allowance: BigNumber = await lpContract.allowance(
          account,
          defaultContracts.masterChef.address
        );
        const hasApprovedPool = !allowance.isZero();

        userData = {
          irisEarned,
          lpStaked,
          hasStaked,
          hasApprovedPool,
        };
      }

      const pool: PoolInfo = {
        pid,
        multiplier,
        active,
        depositFees,
        lpAddress,
        lpToken: symbol,
        totalStaked,
        decimals,
        price,
        ...userData,
        apr,
        apy: "0",
      };

      return pool;
    },
    [account, library]
  );

  return fetchData;
}

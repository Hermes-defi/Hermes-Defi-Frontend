import defaultContracts from "config/contracts";
import TOKENS from "config/tokens";

import { BigNumber, utils } from "ethers";
import { Token, WETH, Fetcher, Route } from "quickswap-sdk";
import { farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { DEFAULT_CHAIN_ID } from "config/constants";

import { useQuery, UseQueryOptions } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef } from "./contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";

export function useTokenPrice(tokenAddress: string, decimals = 18, options: UseQueryOptions = {}) {
  const { library } = useActiveWeb3React();

  return useQuery(
    ["token-price", tokenAddress, decimals],
    async () => {
      try {
        const token = new Token(DEFAULT_CHAIN_ID, tokenAddress, decimals);
        const USDC = new Token(DEFAULT_CHAIN_ID, TOKENS.usdc.address, TOKENS.usdc.decimals);

        const USDCWETHPair = await Fetcher.fetchPairData(USDC, WETH[DEFAULT_CHAIN_ID], library);
        const tokenUSDCPair = await Fetcher.fetchPairData(token, USDC, library);

        const route = new Route([USDCWETHPair, tokenUSDCPair], WETH[DEFAULT_CHAIN_ID]);

        return route.midPrice.toSignificant(6);
      } catch (e) {
        return "0";
      }
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
      const totalStaked = utils.formatEther(
        await lpContract.balanceOf(defaultContracts.masterChef.address)
      );

      // TOKEN PRICE
      let price;

      try {
        const token = new Token(DEFAULT_CHAIN_ID, lpAddress, decimals);
        const USDC = new Token(DEFAULT_CHAIN_ID, TOKENS.usdc.address, TOKENS.usdc.decimals);

        const USDCWETHPair = await Fetcher.fetchPairData(USDC, WETH[DEFAULT_CHAIN_ID], library);
        const tokenUSDCPair = await Fetcher.fetchPairData(token, USDC, library);

        const route = new Route([USDCWETHPair, tokenUSDCPair], WETH[DEFAULT_CHAIN_ID]);
        price = route.midPrice.toSignificant(6);
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

        const lpStaked = utils.formatEther(userInfo.amount);
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

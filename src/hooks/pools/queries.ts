import defaultContracts from "config/contracts";
import BigNumberJS from "bignumber.js";
import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { BigNumber, utils } from "ethers";
import { farmsDefaultData, poolDefaultData } from "config/pools";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef, useUniPair } from "../contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";
import { fetchPairPrice, fetchPrice } from "hooks/prices";

const IRIS_PER_BLOCK = 0.4;
export function useFetchPoolData(irisPrice: string) {
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const getPairContract = useUniPair();
  const { account, library } = useActiveWeb3React();

  const defaultData = [...farmsDefaultData, ...poolDefaultData];
  const fetchData = useCallback(
    async (pid: number) => {
      let poolInfo = defaultData.find((d) => d.pid === pid);
      try {
        // fetch data from contract
        let masterChefInfo = await masterChef.poolInfo(pid);

        // override data with contract data
        poolInfo.multiplier = masterChefInfo.allocPoint.toString();
        poolInfo.active = masterChefInfo.allocPoint.toString() !== "0";
        poolInfo.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();
        poolInfo.lpAddress = masterChefInfo.lpToken;
      } catch (e) {
        //  if we can't fetch pool data then use the default data
        return poolInfo;
      }

      // TOKEN/PAIR DATA
      let lpContract = getLpContract(poolInfo.lpAddress);
      poolInfo.totalStaked = utils.formatUnits(
        await lpContract.balanceOf(defaultContracts.masterChef.address),
        poolInfo.decimals
      );

      // TOKEN PRICE
      if (poolInfo.isFarm) {
        lpContract = getPairContract(poolInfo.lpAddress);

        const totalSupply = utils.formatUnits(await lpContract.totalSupply(), poolInfo.decimals);

        const token0 = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.pairTokens[0].tokenAddress,
          poolInfo.pairTokens[0].tokenDecimals,
          poolInfo.pairTokens[0].tokenName
        );

        const token1 = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.pairTokens[1].tokenAddress,
          poolInfo.pairTokens[1].tokenDecimals,
          poolInfo.pairTokens[1].tokenName
        );

        poolInfo.price = await fetchPairPrice(token0, token1, totalSupply, library);
      } else {
        poolInfo.token = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.lpAddress,
          poolInfo.decimals,
          poolInfo.lpToken
        );

        // TOKEN PRICE
        poolInfo.price = await fetchPrice(poolInfo.token, library);
      }

      // APR
      const rewardsPerWeek = IRIS_PER_BLOCK * (604800 / 2.1);
      const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

      const poolRewardsPerWeek = new BigNumberJS(poolInfo.multiplier)
        .div(totalAllocPoints)
        .times(rewardsPerWeek)
        .toNumber();

      // GET APY
      const apr = getPoolApr(
        parseFloat(irisPrice || "0"),
        poolRewardsPerWeek,
        parseFloat(poolInfo.price || "0"),
        parseFloat(poolInfo.totalStaked || "0")
      );

      poolInfo.apr = apr.yearlyAPR;

      if (account) {
        poolInfo.irisEarned = utils.formatEther(await masterChef.pendingIris(pid, account));
        const userInfo = await masterChef.userInfo(pid, account);

        poolInfo.lpStaked = utils.formatUnits(userInfo.amount, poolInfo.decimals);
        poolInfo.hasStaked = !(userInfo.amount as BigNumber).isZero();

        const allowance: BigNumber = await lpContract.allowance(
          account,
          defaultContracts.masterChef.address
        );
        poolInfo.hasApprovedPool = !allowance.isZero();
      }

      return poolInfo;
    },
    [account, library, irisPrice]
  );

  return fetchData;
}

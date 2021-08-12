import defaultContracts from "config/contracts";
import { BigNumber, utils } from "ethers";
import { farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef } from "../contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";
import { fetchPrice } from "hooks/prices";

export function useFetchPoolData(irisPrice: string) {
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
      let price = await fetchPrice(lpAddress, decimals, symbol, library);

      // GET APY
      const apr = getPoolApr(price, parseFloat(irisPrice) || 0, totalStaked, 0.4);

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
    [account, library, irisPrice]
  );

  return fetchData;
}

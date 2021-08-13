import defaultContracts from "config/contracts";
import BigNumberJS from "bignumber.js";
import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { BigNumber, utils } from "ethers";
import { farmsDefaultData, poolDefaultData } from "config/pools";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef } from "../contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";
import { fetchPrice } from "hooks/prices";

const IRIS_PER_BLOCK = 0.4;
export function useFetchPoolData(irisPrice: string) {
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
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
      const lpContract = getLpContract(poolInfo.lpAddress);
      poolInfo.totalStaked = utils.formatUnits(
        await lpContract.balanceOf(defaultContracts.masterChef.address),
        poolInfo.decimals
      );

      if (poolInfo.isFarm) {
        poolInfo.price = "1";
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

      if (!poolInfo.isFarm) {
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
      }

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

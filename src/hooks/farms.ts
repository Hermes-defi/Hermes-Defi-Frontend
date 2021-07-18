import { useState, useEffect, useCallback } from "react";
import { useGetContract, defaultContracts } from "./useContract";
import { BigNumber, Contract, utils } from "ethers";

import Erc20ABI from "abis/ERC20.json";

type PoolInfo = {
  pid: number;
  active: boolean;
  staked: boolean; // requires user
  token: string;
  multiplier: string;
  apy: number;
  apr: number;
  earn: string;
  depositFees: number;
  irisEarned: number; // requires user
  irisStaked: number; // requires user
  totalLiquidity: number;
  userLiquidity: number; // requires user
  lpAddress: string;
};

const BLOCKS_PER_YEAR = 15768000;

async function calculateAPR(pool: any, contract: Contract) {
  const amount = utils.parseEther("1");
  const depositFees = BigNumber.from(pool.depositFeeBP).div(100);
  const fees = depositFees.mul(amount).div(100);

  const multiplier = BigNumber.from(BLOCKS_PER_YEAR);
  const allocPoint = pool.allocPoint as BigNumber;
  const accIrisPerShare = pool.accIrisPerShare as BigNumber;
  const irisPerBlock = (await contract.irisPerBlock()) as BigNumber;
  const totalAllocPoint = (await contract.totalAllocPoint()) as BigNumber;

  const interest = multiplier
    .mul(allocPoint)
    .mul(accIrisPerShare)
    .mul(irisPerBlock)
    .mul(amount)
    .div(totalAllocPoint);

  const numberOfDays = BigNumber.from(365);

  const apr = fees.add(interest).mul(100);
  const apy = BigNumber.from(1).add(apr.div(numberOfDays)).pow(numberOfDays).sub(1);

  return 0;
}

function useFetchPoolInfo(poolType: "farms" | "pools"): [PoolInfo[], () => Promise<void>] {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[]>([]);
  const getContract = useGetContract(true);

  const fetchPoolInfo = useCallback(async () => {
    try {
      // get farms length
      const masterChefContract = getContract(defaultContracts.masterChef);
      const poolLength = (await masterChefContract.poolLength()).toNumber();
      const pools = [];

      // get individual farms
      for (let idx = 0; idx < poolLength; idx++) {
        const poolInfo: any = {};
        poolInfo.pid = idx;
        const pool = await masterChefContract.poolInfo(idx);

        // apply pool info
        poolInfo.multiplier = pool.allocPoint.div(100).toString();
        poolInfo.active = poolInfo.multiplier !== "0";
        poolInfo.depositFees = BigNumber.from(pool.depositFeeBP).div(100).toNumber();
        poolInfo.earn = "IRIS";

        // calculate apy and apr
        poolInfo.apy = 0;
        poolInfo.apr = 0;

        // add a check to know if it's the IRIS-MATIC LP token
        // if it is add it to the farms list

        // get lp info
        const lpContract = getContract({ address: pool.lpToken, abi: Erc20ABI });
        const symbol = await lpContract.symbol();
        poolInfo.token = symbol;
        poolInfo.lpAddress = pool.lpToken;

        // get user staked info
        poolInfo.irisEarned = 0;
        poolInfo.irisStaked = 0;

        // calculate total Liquidity
        poolInfo.totalLiquidity = utils.formatEther(
          await lpContract.balanceOf(defaultContracts.masterChef.address)
        );
        poolInfo.userLiquidity = 0;

        // console.log(pool);
        pools.push(poolInfo);
      }

      setPoolInfo(pools);
    } catch (err) {
      console.error(`[useFetchPoolInfo][error] general error - ${err.message}`, {
        err,
      });
    }
  }, [getContract]);

  return [poolInfo, fetchPoolInfo];
}

export function useGetFarms() {
  const [fetching, setFetching] = useState(false);
  const [farms, fetchFarms] = useFetchPoolInfo("farms");

  useEffect(() => {
    if (fetching) return;
    setFetching(true);
    fetchFarms().finally(() => setFetching(false));
  }, []);

  return { fetching, farms };
}

export function useGetPools() {
  const [fetching, setFetching] = useState(false);
  const [pools, fetchPools] = useFetchPoolInfo("pools");

  useEffect(() => {
    if (fetching) return;
    setFetching(true);
    fetchPools().finally(() => setFetching(false));
  }, []);

  return { fetching, pools };
}

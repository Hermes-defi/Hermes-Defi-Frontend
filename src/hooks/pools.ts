import { useState, useCallback, useReducer, useContext, createContext, Dispatch } from "react";
import { useGetContract, defaultContracts } from "./useContract";
import { BigNumber, Contract, utils, constants } from "ethers";
import { useActiveWeb3React } from "wallet";

import Erc20ABI from "abis/ERC20.json";
import { useToast } from "@chakra-ui/react";

// TYPES
export type PoolInfo = {
  pid: number;
  active: boolean;
  staked: boolean; // requires user
  userApproved: boolean;
  token: string;
  multiplier: string;
  apy: number;
  apr: number;
  earn: string;
  depositFees: number;
  irisEarned: string; // requires user
  irisStaked: string; // requires user
  totalLiquidity: number;
  userLiquidity: number; // requires user
  lpAddress: string;
};

// HELPER
const BLOCKS_PER_YEAR = 15768000;
async function calculateAPR(pool: any, contract: Contract) {
  const amount = utils.parseEther("1");
  const depositFeesInPercent = BigNumber.from(pool.depositFeeBP / 100);
  const fees = amount.mul(depositFeesInPercent).div(100);

  // console.log({ fees: utils.formatEther(fees) });

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

  const apr = fees.add(interest).div(amount).div(numberOfDays).mul(365).mul(100);
  const apy = BigNumber.from(1).add(apr.div(numberOfDays)).pow(numberOfDays).sub(1);

  return [apr, apy];
}

// POOL ACTIONS
export function useFetchPoolInfoCb() {
  const { dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();
  const getContract = useGetContract();

  const fetch = useCallback(async () => {
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
        const [apy, apr] = await calculateAPR(pool, masterChefContract);
        poolInfo.apy = apy.toString();
        poolInfo.apr = apr.toString();

        // add a check to know if it's the IRIS-MATIC LP token
        // if it is add it to the farms list

        // get lp info
        const lpContract = getContract({ address: pool.lpToken, abi: Erc20ABI });
        const symbol = await lpContract.symbol();
        poolInfo.token = symbol;
        poolInfo.lpAddress = pool.lpToken;

        // get user staked info
        poolInfo.irisEarned = "0";
        poolInfo.irisStaked = "0";

        if (account) {
          const irisContract = getContract(defaultContracts.irisToken);
          poolInfo.irisEarned = utils.formatEther(await irisContract.balanceOf(account));

          const userInfo = await masterChefContract.userInfo(idx, account);
          poolInfo.irisStaked = utils.formatEther(userInfo.amount);

          poolInfo.staked = Number(utils.formatEther(userInfo.amount)) > 0;

          // get user permissions
          // check if user has given permission for masterChef to spend the lpTokens
          const allowance: BigNumber = await lpContract.allowance(
            account,
            masterChefContract.address
          );
          poolInfo.userApproved = !allowance.isZero();
        }

        // calculate total Liquidity
        poolInfo.totalLiquidity = utils.formatEther(
          await lpContract.balanceOf(defaultContracts.masterChef.address)
        );
        poolInfo.userLiquidity = 0;

        // console.log(pool);
        pools.push(poolInfo);
        break;
      }

      dispatch({ type: "ADD_POOLS", payload: pools });
    } catch (err) {
      console.error(`[useFetchPoolInfo][error] general error - ${err.message}`, {
        err,
      });
    }
  }, [getContract, account]);

  return fetch;
}

export function useApprovePoolCb() {
  const { state, dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();

  const [requestingApproval, setRequestingApproval] = useState(false);
  const getContract = useGetContract();

  const toast = useToast();

  const approve = useCallback(
    async (pid: number) => {
      try {
        if (requestingApproval) return;
        if (!account) throw new Error("No connected account");
        setRequestingApproval(true);

        const pool = state.pools[pid];
        const lpContract = getContract({ address: pool.lpAddress, abi: Erc20ABI });

        const approveTx = await lpContract.approve(
          defaultContracts.masterChef.address,
          constants.MaxUint256
        );
        await approveTx.wait();

        dispatch({ type: "APPROVE_CONTRACT", payload: { approved: true, pid } });
      } catch (err) {
        console.error(`[useApprovePool][error] general error - ${err.message}`, {
          err,
        });

        toast({
          title: "Error approving token",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });

        return false;
      } finally {
        setRequestingApproval(false);
      }
    },
    [getContract, account, requestingApproval]
  );

  return { requestingApproval, approve };
}

// STATE MANAGEMENT
export const PoolsContext = createContext<{
  state: { type: string; pools: PoolInfo[] };
  dispatch: Dispatch<{ type: string; payload: any }>;
}>({ state: { type: "", pools: [] }, dispatch: () => null });

const poolsReducers = (
  state: { pools: PoolInfo[]; type: string },
  actions: { type: string; payload: any }
) => {
  switch (actions.type) {
    case "ADD_POOLS": {
      return { ...state, pools: actions.payload as PoolInfo[] };
    }

    case "APPROVE_CONTRACT": {
      const { approved, pid } = actions.payload;

      // create a new copy of pools
      const pools = [...state.pools];
      pools[pid].userApproved = approved;

      return { ...state, pools: pools };
    }
  }
  return state;
};

export function usePoolsState(type: string) {
  const [state, dispatch] = useReducer(poolsReducers, {
    type,
    pools: [] as PoolInfo[],
  });

  return { state, dispatch };
}

export function usePoolInfo() {
  return useContext(PoolsContext);
}

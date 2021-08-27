import { PoolInfo } from "config/pools";
import { StakeInfo } from "config/stake";
import { useContext, createContext, Dispatch } from "react";

export const PoolsContext = createContext<[PoolInfo[], Dispatch<{ type: string; payload: any }>]>([
  [],
  () => null,
]);

export const StakePoolContext = createContext<
  [StakeInfo[], Dispatch<{ type: string; payload: any }>]
>([[], () => null]);

export function poolsReducers(state: PoolInfo[], actions: { type: string; payload: any }) {
  switch (actions.type) {
    case "ADD_POOLS": {
      return actions.payload as PoolInfo[];
    }

    case "APPROVE_CONTRACT": {
      const { approved, pid } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      const poolIdx = pools.findIndex((p) => p.pid === pid);
      pools[poolIdx].hasApprovedPool = approved;

      return pools;
    }

    case "UPDATE_POOL": {
      const { data, pid } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      const poolIdx = pools.findIndex((p) => p.pid === pid);
      pools[poolIdx] = data;

      return pools;
    }
  }

  return state;
}

export function stakePoolsReducers(state: StakeInfo[], actions: { type: string; payload: any }) {
  switch (actions.type) {
    case "ADD_POOLS": {
      return actions.payload as StakeInfo[];
    }

    case "APPROVE_CONTRACT": {
      const { approved, address } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      const poolIdx = pools.findIndex((p) => p.address === address);
      pools[poolIdx].hasApprovedPool = approved;

      return pools;
    }

    case "UPDATE_POOL": {
      const { data, address } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      const poolIdx = pools.findIndex((p) => p.address === address);
      pools[poolIdx] = data;

      return pools;
    }
  }

  return state;
}

export function usePoolInfo() {
  return useContext(PoolsContext);
}

export function useStakePoolInfo() {
  return useContext(StakePoolContext);
}

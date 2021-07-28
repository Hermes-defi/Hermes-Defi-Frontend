import { PoolInfo } from "config/pools";
import { createReducerContext } from "react-use";

const poolsReducers = (state: PoolInfo[], actions: { type: string; payload: any }) => {
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
};

const reducerContext = createReducerContext(poolsReducers, null);

export const usePoolInfo = reducerContext[0];
export const PoolsProvider = reducerContext[1];

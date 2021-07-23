import { Dispatch, useContext, createContext } from "react";
import { PoolInfo } from "web3-functions";

export const PoolsContext = createContext<{
  state: PoolInfo[];
  dispatch: Dispatch<{ type: string; payload: any }>;
}>({ state: [], dispatch: () => null });

export const poolsReducers = (state: PoolInfo[], actions: { type: string; payload: any }) => {
  switch (actions.type) {
    case "ADD_POOLS": {
      return actions.payload as PoolInfo[];
    }

    case "APPROVE_CONTRACT": {
      const { approved, pid } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      pools[pid].hasApprovedPool = approved;

      return pools;
    }

    case "UPDATE_POOL": {
      const { data, pid } = actions.payload;

      // create a new copy of pools
      const pools = [...state];
      pools[pid] = data;

      return pools;
    }
  }

  return state;
};

export function usePoolInfo() {
  return useContext(PoolsContext);
}

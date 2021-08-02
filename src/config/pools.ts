import { constants } from "ethers";
import { DEFAULT_CHAIN_ID } from "./constants";

export type PoolInfo = {
  // public data
  pid: number;
  active: boolean;
  multiplier: string;
  depositFees: number;

  // lp data
  lpToken: string;
  lpAddress: string;
  totalStaked: string;
  decimals: number;
  price?: string;
  apy: string;
  apr: number;

  // user data
  hasStaked: boolean;
  hasApprovedPool: boolean;
  irisEarned: string;
  lpStaked: string;
};

export const poolIds = {
  137: [0, 1, 2, 3, 4, 5, 6, 7],
  80001: [1],
}[DEFAULT_CHAIN_ID];

export const farmIds = {
  137: [8],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const poolDefaultData = {
  137: [],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const farmsDefaultData = {
  137: [
    {
      pid: 8,
      active: true,
      multiplier: "0",
      depositFees: 0,
      lpToken: "IRIS/WMATIC",
      lpAddress: constants.AddressZero,
      price: "0",
      totalStaked: 0,
      hasStaked: false,
      hasApprovedPool: false,
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID];

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
  apy: string;
  apr: number;

  // user data
  hasStaked: boolean;
  hasApprovedPool: boolean;
  irisEarned: string; // requires user
  lpStaked: string; // requires user
};

export const poolIds = {
  137: [],
  80001: [1],
}[DEFAULT_CHAIN_ID];

export const farmIds = {
  137: [],
  80001: [],
}[DEFAULT_CHAIN_ID];

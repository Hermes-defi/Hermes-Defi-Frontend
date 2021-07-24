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

export const poolIds = [0];
export const farmIds = [];

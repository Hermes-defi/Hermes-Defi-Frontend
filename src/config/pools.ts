import { DEFAULT_CHAIN_ID } from "./constants";

export type Pool = {
  // pool data
  pid: number;
  multiplier: string;
  depositFees: number;
  vaultPool?: boolean;

  // ui options
  isSpecial?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string;
    price?: string;
  };

  totalStaked?: string;

  apr?: {
    yearlyAPR: number;
    weeklyAPR: number;
    dailyAPR: number;
  };

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  rewardsEarned?: string;
  userTotalStaked?: string;
};

export const pools: Pool[] = {
  137: [
    {
      pid: 0,
      multiplier: "15",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0x577aa684B89578628941D648f1Fbd6dDE338F059",
        symbol: "APOLLO",
        decimals: 18,
        logo: "/apollo-logo.png",
      },
    },
    {
      pid: 1,
      multiplier: "10",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((p: Pool) => !p.isDisabled);

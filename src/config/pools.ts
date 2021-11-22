import { DEFAULT_CHAIN_ID } from "./constants";

export type Pool = {
  // pool data
  pid: number;
  multiplier: string;
  depositFees: number;

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
  1666600000: [
    {
      pid: 0,
      multiplier: "80",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        symbol: "PLUTUS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },
    },

    {
      pid: 1,
      multiplier: "15",
      depositFees: 4,
      isActive: true,

      stakeToken: {
        address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
        symbol: "WONE",
        decimals: 18,
        logo: "/harmony-one-logo.png",
      },
    },

    {
      pid: 2,
      multiplier: "15",
      depositFees: 4,
      isActive: true,

      stakeToken: {
        address: "0xafd37a86044528010d0e70cdc58d0a9b5eb03206",
        symbol: "PLUTUS/ONE",
        decimals: 18,
        logo: "/harmony-one-logo.png",
      },
    },

  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((p: Pool) => !p.isDisabled);

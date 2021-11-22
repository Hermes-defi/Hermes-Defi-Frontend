import { DEFAULT_CHAIN_ID } from "./constants";

export type Farm = {
  // pool data
  pid: number;
  multiplier: string;
  depositFees: number;

  // ui options
  isSpecial?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;

  farmDx?: string;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  pairs: {
    address: string;
    decimals: number;
    symbol: string;
  }[];

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

export const farms: Farm[] = {
  1666600000: [
    {
      pid: 0,
      multiplier: "160",
      depositFees: 0,

      isActive: true,
      isSpecial: true,
      farmDx: "sushiswap",

      stakeToken: {
        address: "0xafd37a86044528010d0e70cdc58d0a9b5eb03206",
        symbol: "PLUTUS/WONE",
        decimals: 18,
        logo: ["/plutus-logo.png", "/harmony-one-logo.png"],
      },

      pairs: [
        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
        {
          address: "0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
          decimals: 18,
          symbol: "PLUTUS",
        },
      ],
    },
  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((farm: Farm) => !farm.isDisabled);

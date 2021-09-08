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

  badge?: string[];

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  pairs: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
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
  137: [
    {
      pid: 8,
      multiplier: "160",
      depositFees: 0,

      isSpecial: true,
      badge: ["Quickswap"],

      stakeToken: {
        address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
        symbol: "IRIS/WMATIC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/matic-logo.png"],
      },

      pairs: [
        {
          tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          tokenDecimals: 18,
          tokenName: "WMATIC",
        },
        {
          tokenAddress: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          tokenDecimals: 18,
          tokenName: "IRIS",
        },
      ],
    },
    {
      pid: 16,
      multiplier: "60",
      depositFees: 0,

      isSpecial: true,
      badge: ["Quickswap"],

      stakeToken: {
        address: "0x302f7e9bb5b5ac673ac537f464a1b7a36bbbabfa",
        symbol: "IRIS/KOGECOIN",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/koge-logo.jpeg"],
      },

      pairs: [
        {
          tokenAddress: "0x13748d548D95D78a3c83fe3F32604B4796CFfa23",
          tokenDecimals: 9,
          tokenName: "KOGECOIN",
        },
        {
          tokenAddress: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          tokenDecimals: 18,
          tokenName: "IRIS",
        },
      ],
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((farm: Farm) => !farm.isDisabled);

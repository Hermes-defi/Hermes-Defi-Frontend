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
  137: [
    {
      pid: 6,
      multiplier: "30",
      depositFees: 0,

      isActive: true,
      isSpecial: true,
      farmDx: "quickswap",

      stakeToken: {
        address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
        symbol: "IRIS/WMATIC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/matic-logo.png"],
      },

      pairs: [
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          symbol: "WMATIC",
        },
        {
          address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          decimals: 18,
          symbol: "IRIS",
        },
      ],
    },

    {
      pid: 7,
      multiplier: "20",
      depositFees: 0,

      isActive: true,
      isSpecial: true,
      farmDx: "dfyn",

      stakeToken: {
        address: "0x277D9B07671eB9ac0d5D63E15BeEdc0aDBE3e9Fd",
        symbol: "IRIS/USDC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/usdc-logo.png"],
      },

      pairs: [
        {
          address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          decimals: 6,
          symbol: "USDC",
        },
        {
          address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          decimals: 18,
          symbol: "IRIS",
        },
      ],
    },

    {
      pid: 9,
      multiplier: "75",
      depositFees: 0,

      isActive: true,
      isSpecial: true,
      farmDx: "dfyn",

      stakeToken: {
        address: "0x98c2343c581a95BB51b4cE4D76015923D7dD3a23",
        symbol: "APOLLO/IRON",
        decimals: 18,
        logo: ["/apollo-logo.png", "/iron-logo.png"],
      },

      pairs: [
        {
          address: "0x577aa684b89578628941d648f1fbd6dde338f059",
          decimals: 18,
          symbol: "APOLLO",
        },
        {
          address: "0xd86b5923f3ad7b585ed81b448170ae026c65ae9a",
          decimals: 18,
          symbol: "IRON",
        },
      ],
    },

    {
      pid: 10,
      multiplier: "20",
      depositFees: 0,

      isActive: true,
      isSpecial: true,
      farmDx: "dfyn",

      stakeToken: {
        address: "0xE6a2631D6Ef2BD7921cE6d51758c0249270A2B63",
        symbol: "APOLLO/ICE",
        decimals: 18,
        logo: ["/apollo-logo.png", "/ice-logo.png"],
      },

      pairs: [
        {
          address: "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef",
          decimals: 18,
          symbol: "ICE",
        },
        {
          address: "0x577aa684b89578628941d648f1fbd6dde338f059",
          decimals: 18,
          symbol: "APOLLO",
        },
      ],
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((farm: Farm) => !farm.isDisabled);

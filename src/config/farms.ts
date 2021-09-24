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
      pid: 8,
      multiplier: "160",
      depositFees: 0,

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
      pid: 16,
      multiplier: "60",
      depositFees: 0,

      isSpecial: true,
      farmDx: "quickswap",

      stakeToken: {
        address: "0x302f7e9bb5b5ac673ac537f464a1b7a36bbbabfa",
        symbol: "IRIS/KOGECOIN",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/koge-logo.jpeg"],
      },

      pairs: [
        {
          address: "0x13748d548D95D78a3c83fe3F32604B4796CFfa23",
          decimals: 9,
          symbol: "KOGECOIN",
        },
        {
          address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          decimals: 18,
          symbol: "IRIS",
        },
      ],
    },
    {
      pid: 17,
      multiplier: "160",
      depositFees: 0,

      isSpecial: true,
      farmDx: "dfyn",

      stakeToken: {
        address: "0x277d9b07671eb9ac0d5d63e15beedc0adbe3e9fd",
        symbol: "IRIS/USDC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/usdc-logo.png"],
      },

      pairs: [
        {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
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
      pid: 18,
      multiplier: "45",
      depositFees: 2,

      isSpecial: false,
      farmDx: "dfyn",

      stakeToken: {
        address: "0xb0dc320ea9eea823a150763abb4a7ba8286cd08b",
        symbol: "ROUTER/DFYN",
        decimals: 18,
        logo: ["/router-logo.png", "/dfyn-logo.svg"],
      },

      pairs: [
        {
          address: "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4",
          decimals: 18,
          symbol: "ROUTE",
        },
        {
          address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
          decimals: 18,
          symbol: "DFYN",
        },
      ],
    },

    {
      pid: 21,
      multiplier: "20",
      depositFees: 0,

      isSpecial: true,
      farmDx: "quickswap",

      stakeToken: {
        address: "0x8bd49c0106da8618128e56f57e0d4b8d820d9d72",
        symbol: "IRIS/TETU",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/tetu-logo.svg"],
      },

      pairs: [
        {
          address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
          decimals: 18,
          symbol: "IRIS",
        },
        {
          address: "0x255707b70bf90aa112006e1b07b9aea6de021424",
          decimals: 18,
          symbol: "TETU",
        },
      ],
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((farm: Farm) => !farm.isDisabled);

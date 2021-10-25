import { DEFAULT_CHAIN_ID } from "./constants";

export type Balancer = {
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
    logo: string;
    price?: string;
  };

  pairs: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
  }[];

  balancerAddress?: string;
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

export const balancers: Balancer[] = {
  137: [
    {
      pid: 8,
      multiplier: "15",
      depositFees: 0,

      isActive: false,
      isSpecial: true,
      farmDx: "Balancer",

      stakeToken: {
        address: "0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3",
        symbol: "W/U/W/B/I BPT",
        decimals: 18,
        logo: "/WETH__WMATIC__BAL__USDC__IRIS.png",
      },

      pairs: [
        {
          tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          tokenDecimals: 18,
          tokenName: "WMATIC",
        },
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          tokenDecimals: 6,
          tokenName: "USDC",
        },
        {
          tokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          tokenDecimals: 18,
          tokenName: "WETH",
        },
        {
          tokenAddress: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
          tokenDecimals: 18,
          tokenName: "BAL",
        },
        {
          tokenAddress: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
          tokenDecimals: 18,
          tokenName: "IRIS",
        },
      ],

      balancerAddress: "0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3000100000000000000000044",
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: Balancer) => !p.isDisabled);

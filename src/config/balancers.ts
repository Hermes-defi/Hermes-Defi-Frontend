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
      pid: 10,
      multiplier: "15",
      depositFees: 3,

      isActive: false,
      farmDx: "Balancer",

      stakeToken: {
        address: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42",
        symbol: "U/D/M/U BPT",
        decimals: 18,
        logo: "/USDC__USDT__DAI__miMATIC.png",
      },

      pairs: [
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          tokenDecimals: 6,
          tokenName: "USDC",
        },
        {
          tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          tokenDecimals: 18,
          tokenName: "DAI",
        },
        {
          tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          tokenDecimals: 18,
          tokenName: "DAI",
        },
        {
          tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          tokenDecimals: 6,
          tokenName: "USDT",
        },
      ],

      balancerAddress: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012",
    },
    {
      pid: 11,
      multiplier: "30",
      depositFees: 2,

      isActive: false,
      farmDx: "Balancer",

      stakeToken: {
        address: "0xce66904b68f1f070332cbc631de7ee98b650b499",
        symbol: "L/W/B/A BPT",
        decimals: 18,
        logo: "/AAVEBALLINKETH.png",
      },

      pairs: [
        {
          tokenAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
          tokenDecimals: 18,
          tokenName: "LINK",
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
          tokenAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
          tokenDecimals: 18,
          tokenName: "AAVE",
        },
      ],

      balancerAddress: "0xce66904b68f1f070332cbc631de7ee98b650b499000100000000000000000009",
    },
    {
      pid: 12,
      multiplier: "60",
      depositFees: 1,

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

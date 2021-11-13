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
      isActive: false,

      stakeToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },
    },

    {
      pid: 1,
      multiplier: "15",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        symbol: "WETH",
        decimals: 18,
        logo: "/eth-logo.png",
      },
    },

    {
      pid: 2,
      multiplier: "10",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        symbol: "WBTC",
        decimals: 8,
        logo: "/btc-logo.png",
      },
    },

    {
      pid: 3,
      multiplier: "15",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        symbol: "WMATIC",
        decimals: 18,
        logo: "/matic-logo.png",
      },
    },

    {
      pid: 4,
      multiplier: "10",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        symbol: "QUICK",
        decimals: 18,
        logo: "/quickswap-logo.jpeg",
      },
    },

    {
      pid: 5,
      multiplier: "10",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        symbol: "USDC",
        decimals: 6,
        logo: "/usdc-logo.png",
      },
    },

    {
      pid: 6,
      multiplier: "10",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        symbol: "USDT",
        decimals: 6,
        logo: "/usdt-logo.png",
      },
    },

    {
      pid: 7,
      multiplier: "10",
      depositFees: 4,
      isActive: false,

      stakeToken: {
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        symbol: "DAI",
        decimals: 18,
        logo: "/dai-logo.png",
      },
    },
    {
      pid: 9,
      multiplier: "5",
      depositFees: 3,
      isActive: false,

      stakeToken: {
        address: "0x5ac3ceee2c3e6790cadd6707deb2e87ea83b0631",
        symbol: "AES",
        decimals: 9,
        logo: "/aes-logo.png",
      },
    },
    {
      pid: 13,
      multiplier: "5",
      depositFees: 3,
      isActive: false,

      stakeToken: {
        address: "0xbc7cB585346f4F59d07121Bb9Ed7358076243539",
        symbol: "SILVER",
        decimals: 18,
        logo: "/silver-logo.png",
      },
    },
    {
      pid: 14,
      multiplier: "5",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0x3a3df212b7aa91aa0402b9035b098891d276572b",
        symbol: "FISH",
        decimals: 18,
        logo: "/fish-logo.svg",
      },
    },
    {
      pid: 15,
      multiplier: "3",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0xC4Df0E37e4ad3e5C6D1dF12d3Ca7Feb9d2B67104",
        symbol: "KAVIAN",
        decimals: 18,
        logo: "/kavian-logo.png",
      },
    },
    {
      pid: 19,
      multiplier: "8",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4",
        symbol: "ROUTER",
        decimals: 18,
        logo: "/router-logo.png",
      },
    },
    {
      pid: 20,
      multiplier: "8",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
        symbol: "DFYN",
        decimals: 18,
        logo: "/dfyn-logo.svg",
      },
    },
    {
      pid: 22,
      multiplier: "2",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0x8a953cfe442c5e8855cc6c61b1293fa648bae472",
        symbol: "PolyDoge",
        decimals: 18,
        logo: "/polydoge-logo.png",
      },
    },
    {
      pid: 23,
      multiplier: "1",
      depositFees: 2,
      isActive: false,

      stakeToken: {
        address: "0x8c9aAcA6e712e2193acCCbAC1a024e09Fb226E51",
        symbol: "GBNT",
        decimals: 18,
        logo: "/gbnt-logo.png",
      },
    },
  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((p: Pool) => !p.isDisabled);

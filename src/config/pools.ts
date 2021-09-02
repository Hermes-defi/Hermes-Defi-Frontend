import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID } from "./constants";

export type PoolInfo = {
  // public data
  pid: number;
  multiplier: string;
  depositFees: number;
  isFarm?: boolean;
  isBalancer?: boolean;
  active?: boolean;
  farmDx?: string;
  isSpecial?: boolean;
  poolImage: string | string[];

  // lp data
  lpToken: string;
  lpAddress: string;
  decimals: number;
  pairTokens?: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
  }[];
  balancerAddress?: string;
  token?: Token;
  totalStaked?: string;
  price?: string;
  apy?: string;
  apr?: { yearlyAPR: number; weeklyAPR: number; dailyAPR: number };

  // user data
  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  irisEarned?: string;
  lpStaked?: string;
};

export const poolDefaultData: PoolInfo[] = {
  137: [
    {
      pid: 0,
      multiplier: "80",
      depositFees: 0,
      isSpecial: true,
      lpToken: "IRIS",
      lpAddress: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
      decimals: 18,
      poolImage: "/hermes-logo-1.png",
    },

    {
      pid: 1,
      multiplier: "15",
      depositFees: 4,
      lpToken: "WETH",
      lpAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      poolImage: "/eth-logo.png",
    },

    {
      pid: 2,
      multiplier: "10",
      depositFees: 4,
      lpToken: "WBTC",
      lpAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      decimals: 8,
      poolImage: "/btc-logo.png",
    },

    {
      pid: 3,
      multiplier: "15",
      depositFees: 4,
      lpToken: "WMATIC",
      lpAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
      poolImage: "/matic-logo.png",
    },

    {
      pid: 4,
      multiplier: "10",
      depositFees: 4,
      lpToken: "QUICK",
      lpAddress: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
      decimals: 18,
      poolImage: "/quickswap-logo.jpeg",
    },

    {
      pid: 5,
      multiplier: "10",
      depositFees: 4,
      lpToken: "USDC",
      lpAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      poolImage: "/usdc-logo.png",
    },

    {
      pid: 6,
      multiplier: "10",
      depositFees: 4,
      lpToken: "USDT",
      lpAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      poolImage: "/usdt-logo.png",
    },

    {
      pid: 7,
      multiplier: "10",
      depositFees: 4,
      lpToken: "DAI",
      lpAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      poolImage: "/dai-logo.png",
    },
    {
      pid: 9,
      multiplier: "5",
      depositFees: 3,
      lpToken: "AES",
      lpAddress: "0x5ac3ceee2c3e6790cadd6707deb2e87ea83b0631",
      decimals: 9,
      poolImage: "/aes-logo.png",
    },
    {
      pid: 13,
      multiplier: "5",
      depositFees: 3,
      lpToken: "SILVER",
      lpAddress: "0xbc7cB585346f4F59d07121Bb9Ed7358076243539",
      decimals: 18,
      poolImage: "/silver-logo.png",
    },
    {
      pid: 14,
      multiplier: "5",
      depositFees: 2,
      lpToken: "FISH",
      lpAddress: "0xbc7cB585346f4F59d07121Bb9Ed7358076243539",
      decimals: 18,
      poolImage: "/fish-logo.svg",
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const farmsDefaultData: PoolInfo[] = {
  137: [
    {
      pid: 8,
      multiplier: "160",
      depositFees: 0,
      isFarm: true,
      isSpecial: true,
      farmDx: "Quickswap",
      lpToken: "IRIS/WMATIC",
      lpAddress: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
      poolImage: ["/hermes-logo-1.png", "/matic-logo.png"],
      pairTokens: [
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
      decimals: 18,
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const balancersDefaultData: PoolInfo[] = {
  137: [
    {
      pid: 10,
      multiplier: "15",
      depositFees: 3,
      isBalancer: true,
      farmDx: "Balancer",
      poolImage: "/USDC__USDT__DAI__miMATIC.png",
      lpToken: "U/D/M/U BPT",
      lpAddress: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42",
      balancerAddress: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012",
      pairTokens: [
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
      decimals: 18,
    },
    {
      pid: 11,
      multiplier: "30",
      depositFees: 2,
      isBalancer: true,
      farmDx: "Balancer",
      poolImage: "/AAVEBALLINKETH.png",
      lpToken: "L/W/B/A BPT",
      lpAddress: "0xce66904b68f1f070332cbc631de7ee98b650b499",
      balancerAddress: "0xce66904b68f1f070332cbc631de7ee98b650b499000100000000000000000009",
      pairTokens: [
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
      decimals: 18,
    },
    {
      pid: 12,
      multiplier: "60",
      depositFees: 1,
      isBalancer: true,
      isSpecial: true,
      farmDx: "Balancer",
      poolImage: "/WETH__WMATIC__BAL__USDC__IRIS.png",
      lpToken: "W/U/W/B/I BPT",
      lpAddress: "0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3",
      balancerAddress: "0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3000100000000000000000044",
      pairTokens: [
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
      decimals: 18,
    },
  ],
}[DEFAULT_CHAIN_ID];

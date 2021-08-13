import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID } from "./constants";

export type PoolInfo = {
  // public data
  pid: number;
  multiplier: string;
  depositFees: number;
  isFarm?: boolean;
  active?: boolean;
  farmDx?: string;

  // lp data
  lpToken: string;
  lpAddress: string;
  decimals: number;
  pairTokens?: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
  }[];
  token?: Token;
  totalStaked?: string;
  price?: string;
  apy?: string;
  apr?: number;

  // user data
  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  irisEarned?: string;
  lpStaked?: string;
};

export const poolIds = {
  137: [0, 1, 2, 3, 4, 5, 6, 7],
  80001: [1],
}[DEFAULT_CHAIN_ID];

export const farmIds = {
  137: [8],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const poolDefaultData: PoolInfo[] = {
  137: [
    {
      pid: 0,
      multiplier: "40",
      depositFees: 0,
      lpToken: "IRIS",
      lpAddress: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
      decimals: 18,
    },

    {
      pid: 1,
      multiplier: "15",
      depositFees: 4,
      lpToken: "WETH",
      lpAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
    },

    {
      pid: 2,
      multiplier: "10",
      depositFees: 4,
      lpToken: "WBTC",
      lpAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      decimals: 8,
    },

    {
      pid: 3,
      multiplier: "15",
      depositFees: 4,
      lpToken: "WMATIC",
      lpAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
    },

    {
      pid: 4,
      multiplier: "10",
      depositFees: 4,
      lpToken: "QUICK",
      lpAddress: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
      decimals: 18,
    },

    {
      pid: 5,
      multiplier: "10",
      depositFees: 4,
      lpToken: "USDC",
      lpAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
    },

    {
      pid: 6,
      multiplier: "10",
      depositFees: 4,
      lpToken: "USDT",
      lpAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
    },

    {
      pid: 7,
      multiplier: "10",
      depositFees: 4,
      lpToken: "DAI",
      lpAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
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
      farmDx: "Quickswap",
      lpToken: "IRIS/WMATIC",
      lpAddress: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
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
        ,
      ],
      decimals: 18,
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID];

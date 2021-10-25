import { DEFAULT_CHAIN_ID } from "./constants";

export type Pool = {
  // pool data
  pid: number;
  multiplier: string;
  depositFees: number;
  vaultPool?: boolean;

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
  137: [
    {
      pid: 0,
      multiplier: "15",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0x577aa684B89578628941D648f1Fbd6dDE338F059",
        symbol: "APOLLO",
        decimals: 18,
        logo: "/apollo-logo.png",
      },
    },
    {
      pid: 1,
      multiplier: "10",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },
    },
    {
      pid: 2,
      multiplier: "3",
      depositFees: 0,
      isActive: true,
      vaultPool: true,

      stakeToken: {
        address: "0x0f8860515B51bBbB3AEe4603Fe8716454a2Ed24C",
        symbol: "godUSDC/WETH",
        decimals: 18,
        logo: "/god-usdc-weth-logo.png",
      },
    },
    {
      pid: 3,
      multiplier: "3",
      depositFees: 0,
      isActive: true,
      vaultPool: true,

      stakeToken: {
        address: "0xC12b54BAEc88CC4F28501f90Bb189Ac7132ee97F",
        symbol: "godWMATIC/WETH",
        decimals: 18,
        logo: "/god-wmatic-weth-logo.png",
      },
    },
    {
      pid: 4,
      multiplier: "3",
      depositFees: 0,
      isActive: true,
      vaultPool: true,

      stakeToken: {
        address: "0xf32baBB43226DdF187151Eb392c1e7F8C0F4a2BB",
        symbol: "godWBTC/WETH",
        decimals: 18,
        logo: "/god-btc-weth-logo.png",
      },
    },
    {
      pid: 5,
      multiplier: "3",
      depositFees: 0,
      isActive: true,
      vaultPool: true,

      stakeToken: {
        address: "0xaaF43E30e1Aa6ed2dfED9CCD03AbAF7C34B5B8F6",
        symbol: "godUSDC/USDT",
        decimals: 18,
        logo: "/god-usdc-usdt-logo.png",
      },
    },
    {
      pid: 11,
      multiplier: "3",
      depositFees: 0,
      isActive: true,
      vaultPool: true,

      stakeToken: {
        address: "0x467cb3cE716e0801355BFb3b3F4070108E46051f",
        symbol: "godDFYN/ROUTE",
        decimals: 18,
        logo: "/god-dfyn-route-logo.png",
      },
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((p: Pool) => !p.isDisabled);

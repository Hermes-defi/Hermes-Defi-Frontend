import { DEFAULT_CHAIN_ID } from "./constants";

export type Vault = {
  address: string;
  stratAddress: string;
  amm: string;
  depositFees: number;
  withdrawFees: number;
  farmPid: number;

  isDisabled?: boolean;
  isActive?: boolean;
  isSpecial?: boolean;

  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  rewardToken: {
    symbol: string;
    decimals: number;
  };

  pairs: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
  }[];

  totalStaked?: string;

  apy?: {
    yearly: string;
    daily: string;
  };

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  userTotalStaked?: string;
};

export const vaults: Vault[] = {
  137: [
    {
      address: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
      stratAddress: "0xd74941d4f9202d7e4c550d344507298a4e3ed2dd",
      isActive: true,
      amm: "quickswap",
      depositFees: 0,
      withdrawFees: 0,
      farmPid: 8,

      stakeToken: {
        address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
        symbol: "IRIS/WMATIC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godIRISWMATIC",
        decimals: 18,
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
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

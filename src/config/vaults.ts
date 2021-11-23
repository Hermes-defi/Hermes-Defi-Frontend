import { DEFAULT_CHAIN_ID } from "./constants";
import defaultContracts from "./contracts";

export type Vault = {
  address: string;
  stratAddress: string;

  masterChefAddress?: string;
  farmAddress?: string;
  farmPid?: number;
  tokenPerBlock?: string;

  amm: string;

  depositFees: number;
  withdrawFees: number;
  performanceFee: number;

  isDisabled?: boolean;
  isActive?: boolean;
  isSpecial?: boolean;

  projectToken?: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  dfynRewardTokens?: {
    address: string;
    symbol: string;
    decimals: number;
    price?: string;
  }[];

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
    address: string;
    decimals: number;
    symbol: string;
  }[];

  totalStaked?: string;

  apy?: {
    yearly: number;
    daily: number;
  };

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  userTotalStaked?: string;
  userAvailableToUnstake?: string;
};

export const vaults: Vault[] = {
  1666600000: [
    // {
    //   address: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
    //   stratAddress: "0xd74941d4f9202d7e4c550d344507298a4e3ed2dd",
    //   masterChefAddress: defaultContracts.masterChef.address,
    //   farmPid: 8,
    //   tokenPerBlock: "400000000000000000",

    //   isActive: false,
    //   amm: "quickswap",
    //   depositFees: 0,
    //   withdrawFees: 0,
    //   performanceFee: 0.0075,

    //   projectToken: {
    //     address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
    //     symbol: "IRIS",
    //     decimals: 18,
    //     logo: "/hermes-logo-1.png",
    //   },

    //   stakeToken: {
    //     address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
    //     symbol: "IRIS/WMATIC",
    //     decimals: 18,
    //     logo: ["/hermes-logo-1.png", "/matic-logo.png"],
    //   },

    //   rewardToken: {
    //     symbol: "godIRISWMATIC",
    //     decimals: 18,
    //   },

    //   pairs: [
    //     {
    //       address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    //       decimals: 18,
    //       symbol: "WMATIC",
    //     },
    //     {
    //       address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
    //       decimals: 18,
    //       symbol: "IRIS",
    //     },
    //   ],
    // },
  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

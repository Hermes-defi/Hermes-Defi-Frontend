import { DEFAULT_CHAIN_ID } from "./constants";

export type StakeInfo = {
  address: string;
  poolSite?: string;

  rewardEndBlock?: string;
  isDisabled?: boolean;
  active?: boolean;
  isSpecial?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
    isLp?: boolean;
    pairs?: {
      address: string;
      decimals: number;
      symbol: string;
    }[];
    farmDx?: string;
  };

  rewardToken: {
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

export const stakingPools: StakeInfo[] = {
  1666600000: [
    //Simple stack token example
    // {
    //   address: "0xFE3583513Ba38B228C7A62B200F71a0ecF337Eb9",
    //   poolSite: "https://kavian.finance/",
    //   active: true,

    //   stakeToken: {
    //     address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
    //     symbol: "IRIS",
    //     decimals: 18,
    //     logo: "/hermes-logo-1.png",
    //   },

    //   rewardToken: {
    //     address: "0xC4Df0E37e4ad3e5C6D1dF12d3Ca7Feb9d2B67104",
    //     symbol: "KAVIAN",
    //     decimals: 18,
    //     logo: "/kavian-logo.png",
    //   },
    // },
    
    //Lp stack token example
    // {
    //   address: "0x850f4a1Da8Ec47C6865B487dF2a59804CFDBE3E0",
    //   active: true,
    //   isSpecial: true,

    //   stakeToken: {
    //     address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
    //     symbol: "IRIS/WMATIC",
    //     decimals: 18,
    //     logo: "/hermes-logo-1.png",
    //     isLp: true,
    //     pairs: [
    //       {
    //         address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    //         decimals: 18,
    //         symbol: "WMATIC",
    //       },
    //       {
    //         address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
    //         decimals: 18,
    //         symbol: "IRIS",
    //       },
    //     ],
    //     farmDx: "quickswap",
    //   },

    //   rewardToken: {
    //     address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
    //     symbol: "IRIS",
    //     decimals: 18,
    //     logo: "/hermes-logo-1.png",
    //   },
    // },
  ],
}[DEFAULT_CHAIN_ID].filter((p: StakeInfo) => !p.isDisabled);

import { DEFAULT_CHAIN_ID } from "./constants";

export type ApolloStakeInfo = {
  address: string;
  poolSite: string;

  rewardEndBlock?: string;
  isDisabled?: boolean;
  active?: boolean;
  isSpecial?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string;
    price?: string;
  };

  rewardToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string;
    price?: string;
  };

  totalStaked?: string;

  poolShare?: string;
  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  rewardsEarned?: string;
  userTotalStaked?: string;
};

export const apolloStakingPools: ApolloStakeInfo[] = {
  137: [
    {
      address: "0x948bc903a311D42a003FC9b39F90cF27aCcEbD4A",
      poolSite: "https://dfyn.network/",
      active: true,

      stakeToken: {
        address: "0xe644be5d4d5e7f16f0039cd67bcd438d1a62ef13",
        symbol: "pAPOLLO",
        decimals: 18,
        logo: "/apollo-logo.png",
      },

      rewardToken: {
        address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
        symbol: "DFYN",
        decimals: 18,
        logo: "/dfyn-logo.svg",
      },
    },
    {
      address: "0x077E13f5e25E94bc1429AC24200F8a0a21AD390A",
      poolSite: "https://www.xdollar.fi/",
      active: true,

      stakeToken: {
        address: "0xe644be5d4d5e7f16f0039cd67bcd438d1a62ef13",
        symbol: "pAPOLLO",
        decimals: 18,
        logo: "/apollo-logo.png",
      },

      rewardToken: {
        address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
        symbol: "XUSD",
        decimals: 18,
        logo: "/xusd-logo.svg",
      },
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: ApolloStakeInfo) => !p.isDisabled);

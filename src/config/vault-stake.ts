import { DEFAULT_CHAIN_ID } from "./constants";

export type VaultStakeInfo = {
  address: string;
  vaultAddress: string;
  poolSite: string;

  rewardEndBlock?: string;
  isDisabled?: boolean;
  active?: boolean;
  isSpecial?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimal: number;
    logo: string;
    price?: string;
  };

  rewardToken: {
    address: string;
    symbol: string;
    decimal: number;
    logo: string;
    price?: string;
  };

  totalStaked?: string;

  poolShare?: string;
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

export const vaultStakingPools: VaultStakeInfo[] = {
  137: [
    {
      address: "0x7164F49cfA6152119009c600e0c3DA736F6cdC6f",
      vaultAddress: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
      poolSite: "https://hermesdefi.io/",
      active: true,

      stakeToken: {
        address: "0xcbd7b263460ad4807deadad3858de6654f082ca4",
        symbol: "godIRIS/WMATIC",
        decimal: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        symbol: "WMATIC",
        decimal: 18,
        logo: "/matic-logo.png",
      },
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: VaultStakeInfo) => !p.isDisabled);

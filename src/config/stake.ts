import { DEFAULT_CHAIN_ID } from "./constants";

export type StakeInfo = {
  address: string;
  active?: boolean;
  isSpecial?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimal: number;
    price?: string;
  };

  rewardToken: {
    address: string;
    symbol: string;
    decimal: number;
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
  137: [
    {
      address: "0xB82bAfDf59167Da04269bdF243E1Bf0D5ac6df13",

      stakeToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimal: 18,
      },

      rewardToken: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        symbol: "USDC",
        decimal: 6,
      },
    },
  ],
}[DEFAULT_CHAIN_ID];

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
      address: "0x7a99d3c5f6aafa527c7d58d579100284ba5f2d1a",

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimal: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0xC4Df0E37e4ad3e5C6D1dF12d3Ca7Feb9d2B67104",
        symbol: "KAVIAN",
        decimal: 18,
        logo: "/kavian-logo.png",
      },
    },

    {
      address: "0xCa0eC1fAE7335469055A3e8B85a21D4CF6bf3F5d",

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimal: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0xf9b4dEFdDe04fe18F5ee6456607F8A2eC9fF6A75",
        symbol: "SANDMAN",
        decimal: 18,
        logo: "/sandman-logo.png",
      },
    },
  ],
}[DEFAULT_CHAIN_ID];

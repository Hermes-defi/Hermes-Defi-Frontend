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
  137: [
    {
      address: "0xFE3583513Ba38B228C7A62B200F71a0ecF337Eb9",
      poolSite: "https://kavian.finance/",
      active: true,

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0xC4Df0E37e4ad3e5C6D1dF12d3Ca7Feb9d2B67104",
        symbol: "KAVIAN",
        decimals: 18,
        logo: "/kavian-logo.png",
      },
    },

    {
      address: "0x7a99d3c5f6aafa527c7d58d579100284ba5f2d1a",
      active: false,
      poolSite: "https://kavian.finance/",

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0xC4Df0E37e4ad3e5C6D1dF12d3Ca7Feb9d2B67104",
        symbol: "KAVIAN (old)",
        decimals: 18,
        logo: "/kavian-logo.png",
      },
    },

    {
      address: "0xCa0eC1fAE7335469055A3e8B85a21D4CF6bf3F5d",
      poolSite: "https://sandman.farm/",
      active: false,

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0xf9b4dEFdDe04fe18F5ee6456607F8A2eC9fF6A75",
        symbol: "SANDMAN",
        decimals: 18,
        logo: "/sandman-logo.png",
      },
    },

    {
      address: "0x0F7B6984900A40a5A7Ae3dF41b2919d36cBa9815",
      poolSite: "https://gamma.polypulsar.farm/",
      active: false,

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0x8c9aAcA6e712e2193acCCbAC1a024e09Fb226E51",
        symbol: "GBNT",
        decimals: 18,
        logo: "/gbnt-logo.png",
      },
    },

    {
      address: "0x768cc7c311Bf62d63FeBEA5bAf798AFEEa4D09AE",
      poolSite: "https://www.centre.io/usdc",
      active: false,
      isSpecial: true,

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC",
        decimals: 6,
        logo: "/usdc-logo.png",
      },
    },

    {
      address: "0xFf11555aedf0cDCA44cA587AeAf7FF4b7F7CD32D",
      poolSite: "https://www.centre.io/usdc",
      active: true,
      isSpecial: true,

      stakeToken: {
        address: "0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC",
        decimals: 6,
        logo: "/usdc-logo.png",
      },
    },
    
    {
      address: "0x850f4a1Da8Ec47C6865B487dF2a59804CFDBE3E0",
      active: true,
      isSpecial: true,

      stakeToken: {
        address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
        symbol: "IRIS/WMATIC",
        decimals: 18,
        logo: "/hermes-logo-1.png",
        isLp: true,
        pairs: [
          {
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            decimals: 18,
            symbol: "WMATIC",
          },
          {
            address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
            decimals: 18,
            symbol: "IRIS",
          },
        ],
        farmDx: "quickswap",
      },

      rewardToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: StakeInfo) => !p.isDisabled);

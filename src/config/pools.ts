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
  1666600000: [
    {
      pid: 0,
      multiplier: "30",
      depositFees: 0,
      isSpecial: true,
      isActive: true,

      stakeToken: {
        address: "0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        symbol: "PLUTUS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },
    },

    {
      pid: 1,
      multiplier: "25",
      depositFees: 0,
      isActive: true,
      isSpecial: true,

      stakeToken: {
        address: "0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },
    },

    {
      pid: 2,
      multiplier: "6",
      depositFees: 3,
      isActive: true,

      stakeToken: {
        address: "0xbb948620fa9cd554ef9a331b13edea9b181f9d45",
        symbol: "wsWAGMI",
        decimals: 18,
        logo: "/wswagmi-logo.png",
      },
    },

    {
      pid: 3,
      multiplier: "6",
      depositFees: 3,
      isActive: true,

      stakeToken: {
        address: "0xe064a68994e9380250cfee3e8c0e2ac5c0924548",
        symbol: "xVIPER",
        decimals: 18,
        logo: "/xviper-logo.png",
      },
    },

    {
      pid: 10,
      multiplier: "6",
      depositFees: 3,
      isActive: true,

      stakeToken: {
        address: "0xd3a50c0dce15c12fe64941ffd2b864e887c9b9e1",
        symbol: "APE",
        decimals: 9,
        logo: "/harmonape-logo.jpg",
      },
    },
    {
      pid: 12,
      multiplier: "6",
      depositFees: 3,
      isActive: true,

      stakeToken: {
        address: "0x72cb10c6bfa5624dd07ef608027e366bd690048f",
        symbol: "JEWEL",
        decimals: 18,
        logo: "/jewel-logo.png"
      }
    }

  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((p: Pool) => !p.isDisabled);

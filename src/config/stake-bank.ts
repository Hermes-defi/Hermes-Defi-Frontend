import { DEFAULT_CHAIN_ID } from "./constants";

export type StakeBankInfo = {
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
    totalSupply?: number;
    percentageLocked?: number;
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

export const stakingBankPools: StakeBankInfo[] = {
  1666600000: [
    //Simple stack token example
    {
      address: "0x1e65212E33EBD11c878920f3dD86524E18b160EC",
      poolSite: "https://hermesdefi.io/",
      active: true,

      stakeToken: {
        address: "0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        symbol: "PLUTUS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },

      rewardToken: {
        address: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
        symbol: "1DAI",
        decimals: 18,
        logo: "/1dai-logo.png",
      },
    },
    
    //Lp stack token example
    {
      address: "0x850f4a1Da8Ec47C6865B487dF2a59804CFDBE3E0",
      active: false,
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
}[DEFAULT_CHAIN_ID].filter((p: StakeBankInfo) => !p.isDisabled);

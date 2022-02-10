import { DEFAULT_CHAIN_ID } from "./constants";

export type StakeBankInfo = {
  address: string;
  poolSite?: string;

  rewardEndBlock?: string;
  isDisabled?: boolean;
  active?: boolean;
  isSpecial: boolean;

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
      address: "0x3074cf20ecd1cfe96b3ee43968d0c426f775171a",
      poolSite: "https://makerdao.com/es/",
      active: true,
      isSpecial: true,

      stakeToken: {
        address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        symbol: "PLTS",
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

    {
      address: "0xB3617363eDEc16cB0D30a5912Eb7A6B1D48e2875",
      poolSite: "https://tranquilitycity.one/",
      active: true,
      isSpecial: false,

      stakeToken: {
        address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        symbol: "PLTS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },

      rewardToken: {
        address: "0xda7fe71960cd1c19e1b86d6929efd36058f60a03",
        symbol: "LUMEN",
        decimals: 18,
        logo: "/lumen-logo.svg",
      },
    },

    {
      address: "0x3636421e71dcf0bfcbb08feeb62e0275ea5acd61",
      poolSite: "https://uniswap.org/",
      active: true,
      isSpecial: false,

      stakeToken: {
        address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        symbol: "PLTS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },

      rewardToken: {
        address: "0x90d81749da8867962c760414c1c25ec926e889b6",
        symbol: "1UNI",
        decimals: 18,
        logo: "/uniswap-logo.png",
      },
    },

    {
      address: "0x6afcc4d422e8d69bbaee3c61080bc1b710c5f0d5",
      poolSite: "https://cosmicuniverse.one/",
      active: true,
      isSpecial: false,

      stakeToken: {
        address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        symbol: "PLTS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },

      rewardToken: {
        address: "0x6afcc4d422e8d69bbaee3c61080bc1b710c5f0d5",
        symbol: "MAGIC",
        decimals: 18,
        logo: "/magic-logo.png",
      },
    },

    // {
    //   address: "0x3074cf20ecd1cfe96b3ee43968d0c426f775171a",
    //   poolSite: "https://hermesdefi.io/",
    //   active: true,
    //   isSpecial: true,

    //   stakeToken: {
    //     address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
    //     symbol: "PLTS",
    //     decimals: 18,
    //     logo: "/plutus-logo.png",
    //   },

    //   rewardToken: {
    //     address: "0xb4441013ea8aa3a9e35c5aca2b037e577948c59e",
    //     symbol: "UNITE",
    //     decimals: 18,
    //     logo: "/unite-logo.svg",
    //   },
    // },

    
    //Lp stack token example
    // {
    //   address: "0x850f4a1Da8Ec47C6865B487dF2a59804CFDBE3E0",
    //   active: false,
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
}[DEFAULT_CHAIN_ID].filter((p: StakeBankInfo) => !p.isDisabled);

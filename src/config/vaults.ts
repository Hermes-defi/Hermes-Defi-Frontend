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
    boostedYearly?: number;
    daily: number;
    dailyWithPool?: number;
    dailyAll?: number;
  };

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  userTotalStaked?: string;
  userAvailableToUnstake?: string;
};

export const vaults: Vault[] = {
  1666600000: [
    // {
    //   address: "0x0B4F4dD7aF72d4Ac34BCb7979856757371Be0AE5",
    //   stratAddress: "0x61fc9316D5Cd856ECf15064E922a014D2d690494",
    //   masterChefAddress: defaultContracts.masterChef.address,
    //   farmPid: 1,
    //   tokenPerBlock: "400000000000000000",

    //   isActive: true,
    //   amm: "sushiswap",
    //   depositFees: 0,
    //   withdrawFees: 0,
    //   performanceFee: 0.0075,

    //   projectToken: {
    //     address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
    //     symbol: "PLTS",
    //     decimals: 18,
    //     logo: "/plutus-logo.png",
    //   },

    //   stakeToken: {
    //     address: "0x39be7c95276954a6f7070f9baa38db2123691ed0",
    //     symbol: "1WBTC/1ETH",
    //     decimals: 18,
    //     logo: ["/btc-logo.png", "/eth-logo.png"],
    //   },

    //   rewardToken: {
    //     symbol: "pSushiWBTC-ETH",
    //     decimals: 18,
    //   },

    //   pairs: [
    //     {
    //       address: "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
    //       decimals: 8,
    //       symbol: "1WBTC",
    //     },
    //     {
    //       address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
    //       decimals: 18,
    //       symbol: "1ETH",
    //     },
    //   ],
    // },

    // {
    //   address: "0xf2eB51Fbc4A8552d8d235560Ea8bA80C1D57E663",
    //   stratAddress: "0x96ef81dA9778b9BCB0f7a7702574C9E99af93487",
    //   masterChefAddress: defaultContracts.masterChef.address,
    //   farmPid: 2,
    //   tokenPerBlock: "400000000000000000",

    //   isActive: true,
    //   amm: "sushiswap",
    //   depositFees: 0,
    //   withdrawFees: 0,
    //   performanceFee: 0.0075,

    //   projectToken: {
    //     address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
    //     symbol: "PLTS",
    //     decimals: 18,
    //     logo: "/plutus-logo.png",
    //   },

    //   stakeToken: {
    //     address: "0x468dc50884962D6F81733aC0c23c04611aC219F9",
    //     symbol: "1SUSHI/WONE",
    //     decimals: 18,
    //     logo: ["/sushi-logo.jpeg", "/harmony-one-logo.png"],
    //   },

    //   rewardToken: {
    //     symbol: "pSUSHI-ONE",
    //     decimals: 18,
    //   },

    //   pairs: [
    //     {
    //       address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
    //       decimals: 8,
    //       symbol: "1SUSHI",
    //     },
    //     {
    //       address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
    //       decimals: 18,
    //       symbol: "1ETH",
    //     },
    //   ],
    // },
    //WBTC/WONE
    {
      address: "0xd49fB583441cC0Fe40b43A87d8EC4C00Cd0Fce42",
      stratAddress: "0x023A26eE3805904b2414d9f2da3e27F82cD56f52",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 5,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0xc3670b927ef42eed252e483e2446352c238d9905",
        symbol: "1WBTC/WONE",
        decimals: 18,
        logo: ["/btc-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiWBTC-ONE",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
          decimals: 8,
          symbol: "1WBTC",
        },
        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

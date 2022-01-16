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
    //   performanceFee: 0.025,

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
    //   performanceFee: 0.025,

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
      performanceFee: 0.025,

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

    {
      address: "0x79C973691Ec9a0338Bae492e5D67509fC6c1161a",
      stratAddress: "0x2746271974F4B0961Eec8941F9D0230d232A8D17",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 1,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0xbf255d8c30dbab84ea42110ea7dc870f01c0013a",
        symbol: "1USDC/WONE",
        decimals: 18,
        logo: ["/usdc-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUSDC-WONE",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x985458e523db3d53125813ed68c274899e9dfab4",
          decimals: 6,
          symbol: "1USDC",
        },
        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    {
      address: "0x70a24716236eE0100Be89fff5A2B1cb454C76B92",
      stratAddress: "0x8b135161c5153F8C0C31A32c536C3829a49BE12D",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 4,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0xda64f9053a971531a75071a729a6432fb65ed60d",
        symbol: "bscBUSD/BUSD",
        decimals: 18,
        logo: ["/busd-logo.png", "/busd-logo.png"],
      },

      rewardToken: {
        symbol: "pSushibscBUSD-BUSD",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x0ab43550a6915f9f67d0c454c2e90385e6497eaa",
          decimals: 18,
          symbol: "bscBUSD",
        },
        {
          address: "0xe176ebe47d621b984a73036b9da5d834411ef734",
          decimals: 18,
          symbol: "BUSD",
        },
      ],
    },

    {
      address: "0xeDB5Aa5708B31c337548A5864555679738190c15",
      stratAddress: "0x1277dB6924Bfd3E9EA0dEcd0fb91123f5f8F655C",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 3,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0xeb049f1ed546f8efc3ad57f6c7d22f081ccc7375",
        symbol: "1ETH/WONE",
        decimals: 18,
        logo: ["/eth-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiETH-ONE",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
        
      ],
    },

    {
      address: "0x563b2825Db199a727d2777FeD371e8228A2537a2",
      stratAddress: "0x5908D34eB884Dbe0e53b0135149493EA9eE19188",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 12,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0x9293dfdd719ee2163f2e158e66ef75722ed712b4",
        symbol: "UST/1ETH",
        decimals: 18,
        logo: ["/ust-logo.png", "/eth-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUST-ETH",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x224e64ec1bdce3870a6a6c777edd450454068fec",
          decimals: 18,
          symbol: "UST",
        },
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
      ],
    },

    {
      address: "0x83A588379FA3521Ba87Fa4f9b979cB5677dFC4EC",
      stratAddress: "0x17aC0362fe6954A33d772Ab660E6f885889929A7",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 6,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0x0c51171b913db10ade3fd625548e69c9c63afb96",
        symbol: "1USDT/1USDC",
        decimals: 18,
        logo: ["/usdt-logo.png", "/usdc-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUSDT-USDC",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
          decimals: 6,
          symbol: "1USDT",
        },
        {
          address: "0x985458e523db3d53125813ed68c274899e9dfab4",
          decimals: 6,
          symbol: "1USDC",
        },
      ],
    },

    {
      address: "0x4cDCBcC6eb171051075f1cd73D78A8AAd9BbcD9C",
      stratAddress: "0x0B4F8Bb803B1a579E637C2B3B87eAbeF54a9EAd4",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      farmPid: 13,
      tokenPerBlock: "400000000000000000",

      isActive: false,
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      projectToken: {
        address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
        symbol: "1SUSHI",
        decimals: 18,
        logo: "/sushi-logo.png",
      },

      stakeToken: {
        address: "0xa46bba980512e328e344ce12bb969563f3429f05",
        symbol: "1ETH/1FRAX",
        decimals: 18,
        logo: ["/eth-logo.png", "/1frax-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiFRAX-ETH",
        decimals: 18,
      },

      pairs: [ 
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
        {
          address: "0xeb6c08ccb4421b6088e581ce04fcfbed15893ac3",
          decimals: 18,
          symbol: "1FRAX",
        },
      ],
    },

  ],
  1666700001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

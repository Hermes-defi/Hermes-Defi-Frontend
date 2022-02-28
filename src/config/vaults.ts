import { DEFAULT_CHAIN_ID } from "./constants";

export type Vault = {
  address: string;
  stratAddress: string;

  masterChefAddress?: string;
  zapAddress?: string;
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

  sushiRewardTokens?: {
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
  vaultType?: string;

  rewardToken: {
    symbol: string;
    decimals: number;
    poolId?: number;
  };

  pairs: {
    address: string;
    decimals: number;
    symbol: string;
  }[];

  totalStaked?: string;
  totalStakedInUSD?: string;

  apy?: {
    yearly: number;
    boostedYearly?: number;
    daily: number;
    dailyWithPool?: number;
    dailyAll?: number;
  };

  approvedTokens?: string[];
  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  hasApprovedZap?: boolean;
  userTotalStaked?: string;
  userAvailableToUnstake?: string;
  hasWalletBalance?: boolean;
};

export const vaults: Vault[] = {
  1666600000: [
    //WBTC/WONE
    {
      address: "0xccb749769511BEa80a3325A57AD1c9dc9BCB61a0",
      stratAddress: "0xCc52f13667FAbc7De18A271197321c18ea6DD9e8",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0xF6d9357d5C0263f12eE94b1f5b81F06fF443EA92",
      farmPid: 5,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0xc3670b927ef42eed252e483e2446352c238d9905",
        symbol: "1WBTC-WONE",
        decimals: 18,
        logo: ["/btc-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiWBTC-ONE",
        decimals: 18,
        poolId: 18,
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
    //USDC/ONE
    {
      address: "0xdC01AC238a0f841a7750f456BFcf1ede486ce7a1",
      stratAddress: "0xF01E18D4F9c51a2d9bE9b0f379be428644EA12A6",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x5dD146dae48Ef47D22769833fe788E5405467Fca",
      farmPid: 1,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0xbf255d8c30dbab84ea42110ea7dc870f01c0013a",
        symbol: "1USDC-WONE",
        decimals: 18,
        logo: ["/usdc-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUSDC-WONE",
        decimals: 18,
        poolId: 17,
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
    //BUSD/bscBUSD
    {
      address: "0xa9988C46187c0f00D8496EA5069aA5141f77eC05",
      stratAddress: "0xa9f22dF0c0607012A1c6E47bB1a176F6AB08b184",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x5180c3D3A0EE6E7A303a5caEd220A7d1fA48403b",
      farmPid: 4,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "stable",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0xda64f9053a971531a75071a729a6432fb65ed60d",
        symbol: "bscBUSD-BUSD",
        decimals: 18,
        logo: ["/busd-logo.png", "/busd-logo.png"],
      },

      rewardToken: {
        symbol: "pSushibscBUSD-BUSD",
        decimals: 18,
        poolId: 20,
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
    //UST/ETH
    {
      address: "0xE26c98dE1E148Ea07a7E7af0720cc8Ea0E1260B1",
      stratAddress: "0x96A21c896F497F7B5fd09444F12C3589b3c6E91E",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x26A0c26479040aE55C1DbD83EFff9405cD6Ad9b6",
      farmPid: 12,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0x9293dfdd719ee2163f2e158e66ef75722ed712b4",
        symbol: "UST-1ETH",
        decimals: 18,
        logo: ["/ust-logo.png", "/eth-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUST-ETH",
        decimals: 18,
        poolId: 19,
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

    //USDT/USDC
    {
      address: "0x148f943E639Fb32fd2899E1fa545B9350ace3d11",
      stratAddress: "0x4B3d4B9742A4cEf4D22FCda11DbD3dD7fb8b047B",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x0aA9CB11821Dd9E2eD15126a1c5346FE4Aadf9fb",
      farmPid: 6,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "stable",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },
        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0x0c51171b913db10ade3fd625548e69c9c63afb96",
        symbol: "1USDT-1USDC",
        decimals: 18,
        logo: ["/usdt-logo.png", "/usdc-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiUSDT-USDC",
        decimals: 18,
        poolId: 21,
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
    //SUSHI/ONE
    {
      address: "0xE78e5eEB4fBC47721fE08CaC423a2eCE6264Bf26",
      stratAddress: "0x560b6C23DA7FE548130e4D9325162936f690F8de",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0xC0a79ef8ff654AC7F896Df9e2d7D18b76545789E",
      farmPid: 7,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0x468dc50884962d6f81733ac0c23c04611ac219f9",
        symbol: "1SUSHI-WONE",
        decimals: 18,
        logo: ["/sushi-logo.jpeg", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiSUSHI-ONE",
        decimals: 18,
        poolId: 22,
      },

      pairs: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    //WBTC-ETH
    {
      address: "0xB2223291cF0aFb0bD135fe09960A3dd1c0CAf841",
      stratAddress: "0x6e8bA4e545bae00447a7E282CAb3A68bF7452d04",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x735c7eC2Afa17280C23cb441D16f20f763AA1f4A",
      farmPid: 10,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0x39be7c95276954a6f7070f9baa38db2123691ed0",
        symbol: "1WBTC-1ETH",
        decimals: 18,
        logo: ["/btc-logo.png", "/eth-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiWBTC-ETH",
        decimals: 18,
        poolId: 24,
      },

      pairs: [
        {
          address: "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
          symbol: "1WBTC",
          decimals: 8,
        },

        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
      ],
    },

     //1ETH-WONE
     {
      address: "0xC0e333196e156B3C910e1AD30dD39530942E9f28",
      stratAddress: "0xfd933004e33Ab6569d7774DcCD6Eb8D80287e4Cf",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x1f7cC1a866a637943D1939dd77a35bb33Fc11480",
      farmPid: 3,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0xeb049f1ed546f8efc3ad57f6c7d22f081ccc7375",
        symbol: "1ETH-WONE",
        decimals: 18,
        logo: ["/eth-logo.png", "/harmony-one-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiETH-ONE",
        decimals: 18,
        poolId: 25,
      },

      pairs: [
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          symbol: "1ETH",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

     //1ETH-1FRAX
     {
      address: "0x5F9B115EC050807F5880bE1f68dB5caA559d8456",
      stratAddress: "0x85B80075DbEe7bAB092dd820F567F4A9fCAa91A2",
      masterChefAddress: "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287",
      zapAddress: "0x0b7321C9A165D7cA24636193126BfA86Eaaff429",
      farmPid: 13,
      tokenPerBlock: "400000000000000000",

      isActive: true,
      vaultType: "lp",
      amm: "sushiswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.025,

      sushiRewardTokens: [
        {
          address: "0xbec775cb42abfa4288de81f387a9b1a3c4bc552a",
          symbol: "1SUSHI",
          decimals: 18,
        },

        {
          address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],

      stakeToken: {
        address: "0xa46bba980512e328e344ce12bb969563f3429f05",
        symbol: "1ETH-1FRAX",
        decimals: 18,
        logo: ["/eth-logo.png", "/1frax-logo.png"],
      },

      rewardToken: {
        symbol: "pSushiETH-FRAX",
        decimals: 18,
        poolId: 26,
      },

      pairs: [
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          symbol: "1ETH",
          decimals: 18,
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

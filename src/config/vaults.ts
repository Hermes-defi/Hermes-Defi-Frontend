import { DEFAULT_CHAIN_ID } from "./constants";
import defaultContracts from "./contracts";

export type Vault = {
  address: string;
  stratAddress: string;
  type?: string;
  isBoosted?: boolean;

  // for masterchef vaults
  masterChefAddress?: string;
  farmPid?: number;
  tokenPerBlock?: string;

  // for dual vaults
  farmAddress?: string;

  // for rewardPool vaults
  rewardPool?: string;

  amm: string;

  depositFees: number;
  withdrawFees: number;
  performanceFee: number;

  isDisabled?: boolean;
  isActive?: boolean;
  isSpecial?: boolean;

  // for masterChef vaults
  projectToken?: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  // for dual vaults
  farmRewardTokens?: {
    address: string;
    symbol: string;
    decimals: number;
    price?: string;
  }[];

  // for rewardPool vaults
  farmRewardToken?: {
    address: string;
    symbol: string;
    decimals: number;
    price?: string;
  };
  farmXTokenAddress?: string;

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
  137: [
    {
      address: "0x0f8860515B51bBbB3AEe4603Fe8716454a2Ed24C",
      stratAddress: "0x855d94a524249e8B9a7827EBdadeE4D027F6b293",
      type: "rewardPool",

      rewardPool: "0xbb703e95348424ff9e94fbe4fb524f6d280331b8",
      farmXTokenAddress: "0xf28164A485B0B2C90639E47b0f377b4a438a16B1",
      farmRewardToken: {
        address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        symbol: "QUICK",
        decimals: 18,
      },

      isActive: true,
      amm: "quickswap",
      depositFees: 3,
      withdrawFees: 0,
      performanceFee: 0.25,

      stakeToken: {
        address: "0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d",
        symbol: "USDC/WETH",
        decimals: 18,
        logo: ["/usdc-logo.png", "/eth-logo.png"],
      },

      rewardToken: {
        symbol: "godUSDCETH",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          decimals: 6,
          symbol: "USDC",
        },
        {
          address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          decimals: 18,
          symbol: "WETH",
        },
      ],
    },

    {
      address: "0xaaF43E30e1Aa6ed2dfED9CCD03AbAF7C34B5B8F6",
      stratAddress: "0x0222b8C573d0484dAc8C02461Bff1F0E070C0075",
      type: "rewardPool",

      rewardPool: "0xafb76771c98351aa7fca13b130c9972181612b54",
      farmXTokenAddress: "0xf28164A485B0B2C90639E47b0f377b4a438a16B1",
      farmRewardToken: {
        address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        symbol: "QUICK",
        decimals: 18,
      },

      isActive: true,
      amm: "quickswap",
      depositFees: 3,
      withdrawFees: 0,
      performanceFee: 0.25,

      stakeToken: {
        address: "0x2cF7252e74036d1Da831d11089D326296e64a728",
        symbol: "USDC/USDT",
        decimals: 18,
        logo: ["/usdc-logo.png", "/usdt-logo.png"],
      },

      rewardToken: {
        symbol: "godUSDCUSDT",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          decimals: 6,
          symbol: "USDC",
        },
        {
          address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          decimals: 6,
          symbol: "USDT",
        },
      ],
    },

    {
      address: "0xC12b54BAEc88CC4F28501f90Bb189Ac7132ee97F",
      stratAddress: "0xdeA2750F45D641a3a50d7143d849BC0E63cd707a",
      type: "dualRewardPool",

      rewardPool: "0x3c1f53fed2238176419f8f897aec8791c499e3c8",
      farmXTokenAddress: "0xf28164A485B0B2C90639E47b0f377b4a438a16B1",
      farmRewardTokens: [
        {
          address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
          symbol: "QUICK",
          decimals: 18,
        },
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          symbol: "WMATIC",
          decimals: 18,
        },
      ],

      isActive: true,
      amm: "quickswap",
      depositFees: 3,
      withdrawFees: 0,
      performanceFee: 0.25,

      stakeToken: {
        address: "0xadbF1854e5883eB8aa7BAf50705338739e558E5b",
        symbol: "WETH/WMATIC",
        decimals: 18,
        logo: ["/eth-logo.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godWMATICETH",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
          decimals: 18,
          symbol: "WMATIC",
        },
        {
          address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          decimals: 18,
          symbol: "WETH",
        },
      ],
    },

    {
      address: "0xf32baBB43226DdF187151Eb392c1e7F8C0F4a2BB",
      stratAddress: "0x41E45FB11E03f4bAC10d9BDB9F1F869452167A99",
      type: "rewardPool",

      rewardPool: "0x2972175e1a35c403b5596354d6459c34ae6a1070",
      farmXTokenAddress: "0xf28164A485B0B2C90639E47b0f377b4a438a16B1",
      farmRewardToken: {
        address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        symbol: "QUICK",
        decimals: 18,
      },

      isActive: true,
      amm: "quickswap",
      depositFees: 3,
      withdrawFees: 0,
      performanceFee: 0.25,

      stakeToken: {
        address: "0xdc9232e2df177d7a12fdff6ecbab114e2231198d",
        symbol: "WBTC/WETH",
        decimals: 18,
        logo: ["/btc-logo.png", "/eth-logo.png"],
      },

      rewardToken: {
        symbol: "godBTCETH",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
          decimals: 8,
          symbol: "WBTC",
        },
        {
          address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          decimals: 18,
          symbol: "WETH",
        },
      ],
    },

    {
      address: "0x467cb3cE716e0801355BFb3b3F4070108E46051f",
      stratAddress: "0x031AE02F2A989E50047aCb9Fc1d3DA11a4Fe259D",
      type: "dual",

      farmAddress: "0xa0d35c593235bA61151F0BAD89A4fB70AA5dad9f",

      isActive: true,
      amm: "dfyn",
      depositFees: 2,
      withdrawFees: 0,
      performanceFee: 0.25,

      farmRewardTokens: [
        {
          address: "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4",
          decimals: 18,
          symbol: "ROUTE",
        },
        {
          address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
          decimals: 18,
          symbol: "DFYN",
        },
      ],

      stakeToken: {
        address: "0xb0dc320ea9eea823a150763abb4a7ba8286cd08b",
        symbol: "DFYN/ROUTE",
        decimals: 18,
        logo: ["/router-logo.png", "/dfyn-logo.svg"],
      },

      rewardToken: {
        symbol: "godDFYN/ROUTE",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4",
          decimals: 18,
          symbol: "ROUTE",
        },
        {
          address: "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97",
          decimals: 18,
          symbol: "DFYN",
        },
      ],
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

import { NumericalBotVersion } from "aws-sdk/clients/lexmodelsv2";
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

  // for masterchef vaults
  projectToken?: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  // for dfyn vaults
  dfynRewardTokens?: {
    address: string;
    symbol: string;
    decimals: number;
    price?: string;
  }[];

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
    daily: number;
    boostedYearly?: number;
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
    //IRIS LAYER

    //IRIS/WMATIC
    {
      address: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
      stratAddress: "0xd74941d4f9202d7e4c550d344507298a4e3ed2dd",
      masterChefAddress: defaultContracts.masterChef.address,
      farmPid: 8,
      tokenPerBlock: "400000000000000000",

      type: "masterchef",
      isActive: false,
      amm: "quickswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        symbol: "IRIS",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      stakeToken: {
        address: "0x86ad6271809f350522085F95F5A67d46ff7ed3AB",
        symbol: "IRIS/WMATIC",
        decimals: 18,
        logo: ["/hermes-logo-1.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godIRISWMATIC",
        decimals: 18,
      },

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
    },
    //KAVIANL2/WMATIC
    {
      address: "0x75fd7fa818f0d970668dca795b7d79508776a5b1",
      stratAddress: "0x570d669b8e2751dfe65bbdd4db3b34b53c9c6d6f",
      masterChefAddress: "0xB664c98548CEbf7024F899e32E467dff00311918",
      farmPid: 1,
      tokenPerBlock: "80000000000000000",

      type: "masterchef",
      isActive: false,
      amm: "quickswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0x9a33bac266b02faff8fa566c8cb5da08820e28ba",
        symbol: "KAVIANL2",
        decimals: 18,
        logo: "/kavian-logo.png",
      },

      stakeToken: {
        address: "0xca2cfc8bf76d9d8eb08e824ee6278f7b885c3b70",
        symbol: "KAVIANL2/WMATIC",
        decimals: 18,
        logo: ["/kavian-logo.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godKAVIANL2/WMATIC",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          symbol: "WMATIC",
        },
        {
          address: "0x9a33bac266b02faff8fa566c8cb5da08820e28ba",
          decimals: 18,
          symbol: "KAVIANL2",
        },
      ],
    },
    //GBNT/WMATIC
    {
      address: "0x483a58Fd4B023CAE2789cd1E1e5F6F52f93df2C7",
      stratAddress: "0x050170ec42eE569512F5077f736c8fd2D41E7983",
      masterChefAddress: "0xA375495919205251a05f3B259B4D3cc30a4d3ED5",
      farmPid: 1,
      tokenPerBlock: "8000000000000000000",

      type: "masterchef",
      isActive: false,
      amm: "polycat",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0x40ed0565ecfb14ebcdfe972624ff2364933a8ce3",
        symbol: "GPUL",
        decimals: 18,
        logo: "/gbnt-logo.png",
      },

      stakeToken: {
        address: "0xd883c361d1e8a7e1f77d38e0a6e45d897006b798",
        symbol: "GBNT/WMATIC",
        decimals: 18,
        logo: ["/gbnt-logo.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godGBNT/WMATIC",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          symbol: "WMATIC",
        },
        {
          address: "0x8c9aaca6e712e2193acccbac1a024e09fb226e51",
          decimals: 18,
          symbol: "GBNT",
        },
      ],
    },
    //WISE/USDC
    {
      address: "0xD4d9a3A705ace962F0813ff0E27c965E1b76357D",
      stratAddress: "0x9291569366739EbA4F9eD8d91794A67EfD26bA65",
      masterChefAddress: "0x62BA727e2449EE3BE0573b4b102D7090c5977BFB",
      farmPid: 17,
      tokenPerBlock: "7000000000000000",

      type: "masterchef",
      isActive: false,
      amm: "polycat",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0x4c19ddeebaf84ca3a255730295ad9d824d4ff51f",
        symbol: "WISE",
        decimals: 18,
        logo: "/wise-logo.png",
      },

      stakeToken: {
        address: "0xB20E03CC86C0d74bF06CD6f31C57cf7c7ba90bED",
        symbol: "WISE/USDC",
        decimals: 18,
        logo: ["/wise-logo.png", "/usdc-logo.png"],
      },

      rewardToken: {
        symbol: "godWISE/USDC",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          decimals: 6,
          symbol: "USDC",
        },
        {
          address: "0x4c19ddeebaf84ca3a255730295ad9d824d4ff51f",
          decimals: 18,
          symbol: "WISE",
        },
      ],
    },
    //WISE/WMATIC
    {
      address: "0x4806743912E5b4Aeb0426671d1F307FC3372642d",
      stratAddress: "0x72b7Ea43ce4bE6876475F4ef0b29cCC11984e5e8",
      masterChefAddress: "0x62BA727e2449EE3BE0573b4b102D7090c5977BFB",
      farmPid: 2,
      tokenPerBlock: "7000000000000000",

      type: "masterchef",
      isActive: false,
      amm: "quickswap",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.0075,

      projectToken: {
        address: "0x4c19ddeebaf84ca3a255730295ad9d824d4ff51f",
        symbol: "WISE",
        decimals: 18,
        logo: "/wise-logo.png",
      },

      stakeToken: {
        address: "0x89d97d96fA57A83e285a5D1709Fc5345C8e92d94",
        symbol: "WISE/WMATIC",
        decimals: 18,
        logo: ["/wise-logo.png", "/matic-logo.png"],
      },

      rewardToken: {
        symbol: "godWISE/WMATIC",
        decimals: 18,
      },

      pairs: [
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          symbol: "WMATIC",
        },
        {
          address: "0x4c19ddeebaf84ca3a255730295ad9d824d4ff51f",
          decimals: 18,
          symbol: "WISE",
        },
      ],
    },
    //ROUTE/DFYN
    {
      address: "0xD55D83f4f3c67E02B6a37E9eAd2396B9a5C9E3F9",
      stratAddress: "0xA94c29711dE2250c026E7d420124E9fD59155F32",

      farmAddress: "0xe194f2cB4da23B1FB26B41Eb818d25d9FC7367f2",

      type: "dfyn",
      isActive: false,
      amm: "dfyn",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

      dfynRewardTokens: [
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
        symbol: "ROUTE/DFYN",
        decimals: 18,
        logo: ["/router-logo.png", "/dfyn-logo.svg"],
      },

      rewardToken: {
        symbol: "godROUTE/DFYN",
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

    //APOLLO LAYER
    
    //USDC/WETH
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
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

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
    //USDC/USDT
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
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

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
    //WETH/WMATIC
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
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

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
    //WBTC/WETH
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
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

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
    //DFYN/ROUTE
    {
      address: "0x467cb3cE716e0801355BFb3b3F4070108E46051f",
      stratAddress: "0x031AE02F2A989E50047aCb9Fc1d3DA11a4Fe259D",
      type: "dual",

      farmAddress: "0xa0d35c593235bA61151F0BAD89A4fB70AA5dad9f",

      isActive: false,
      amm: "dfyn",
      depositFees: 0,
      withdrawFees: 0,
      performanceFee: 0.03,

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

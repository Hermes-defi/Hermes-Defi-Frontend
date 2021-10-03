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
    daily: number;
  };

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  userTotalStaked?: string;
  userAvailableToUnstake?: string;
};

export const vaults: Vault[] = {
  137: [
    {
      address: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
      stratAddress: "0xd74941d4f9202d7e4c550d344507298a4e3ed2dd",
      masterChefAddress: defaultContracts.masterChef.address,
      farmPid: 8,
      tokenPerBlock: "400000000000000000",

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

    {
      address: "0x75fd7fa818f0d970668dca795b7d79508776a5b1",
      stratAddress: "0x570d669b8e2751dfe65bbdd4db3b34b53c9c6d6f",
      masterChefAddress: "0xB664c98548CEbf7024F899e32E467dff00311918",
      farmPid: 1,
      tokenPerBlock: "80000000000000000",

      isActive: true,
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

    {
      address: "0x483a58Fd4B023CAE2789cd1E1e5F6F52f93df2C7",
      stratAddress: "0x050170ec42eE569512F5077f736c8fd2D41E7983",
      masterChefAddress: "0xA375495919205251a05f3B259B4D3cc30a4d3ED5",
      farmPid: 1,
      tokenPerBlock: "8000000000000000000",

      isActive: true,
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

    {
      address: "0xD4d9a3A705ace962F0813ff0E27c965E1b76357D",
      stratAddress: "0x9291569366739EbA4F9eD8d91794A67EfD26bA65",
      masterChefAddress: "0x62BA727e2449EE3BE0573b4b102D7090c5977BFB",
      farmPid: 17,
      tokenPerBlock: "7000000000000000",

      isActive: true,
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

    {
      address: "0x4806743912E5b4Aeb0426671d1F307FC3372642d",
      stratAddress: "0x72b7Ea43ce4bE6876475F4ef0b29cCC11984e5e8",
      masterChefAddress: "0x62BA727e2449EE3BE0573b4b102D7090c5977BFB",
      farmPid: 2,
      tokenPerBlock: "7000000000000000",

      isActive: true,
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

    {
      address: "0xD55D83f4f3c67E02B6a37E9eAd2396B9a5C9E3F9",
      stratAddress: "0xA94c29711dE2250c026E7d420124E9fD59155F32",

      farmAddress: "0xe194f2cB4da23B1FB26B41Eb818d25d9FC7367f2",

      isActive: true,
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
  ],
  80001: [],
}[DEFAULT_CHAIN_ID].filter((vault: Vault) => !vault.isDisabled);

import { DEFAULT_CHAIN_ID } from "./constants";

export type Farm = {
  // pool data
  pid: number;
  multiplier: string;
  depositFees: number;

  // ui options
  isSpecial?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;

  farmDx?: string;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string | string[];
    price?: string;
  };

  pairs: {
    address: string;
    decimals: number;
    symbol: string;
  }[];

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

export const farms: Farm[] = {
  1666600000: [
    {
      pid: 4,
      multiplier: "35",
      depositFees: 3,

      isActive: true,
      isSpecial: true,
      farmDx: "viperswap",

      stakeToken: {
        address: "0x54c59cc0ad2ec1de3c5b7057d900d306f16453ef",
        symbol: "IRIS/ONE",
        decimals: 18,
        logo: ["/harmony-one-logo.png", "/hermes-logo-1.png"],
      },

      pairs: [
        {
          address: "0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
          decimals: 18,
          symbol: "IRIS",
        },
        {
          address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    {
      pid: 5,
      multiplier: "8",
      depositFees: 3,

      isActive: false,
      isSpecial: false,
      farmDx: "viperswap",

      stakeToken: {
        address: "0x1cb93763241e0eee22b098f7d26baa0562f688e7",
        symbol: "wsWAGMI/ONE",
        decimals: 18,
        logo: ["/harmony-one-logo.png", "/wswagmi-logo.png"],
      },

      pairs: [
        {
          address: "0xbb948620fa9cd554ef9a331b13edea9b181f9d45",
          decimals: 18,
          symbol: "wsWAGMI",
        },
        {
          address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    {
      pid: 6,
      multiplier: "8",
      depositFees: 3,

      isActive: false,
      isSpecial: false,
      farmDx: "viperswap",

      stakeToken: {
        address: "0x96025483bd32c645b822a5a08004b84d674537cb",
        symbol: "ONE/VIPER",
        decimals: 18,
        logo: ["/harmony-one-logo.png", "/viper-logo.png"],
      },

      pairs: [
        {
          address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          decimals: 18,
          symbol: "WONE",
        },
        {
          address: "0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79",
          decimals: 18,
          symbol: "VIPER",
        },
      ],
    },

    {
      pid: 7,
      multiplier: "10",
      depositFees: 3,

      isActive: true,
      isSpecial: false,
      farmDx: "dfk",

      stakeToken: {
        address: "0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f",
        symbol: "JEWEL/ONE",
        decimals: 18,
        logo: ["/harmony-one-logo.png", "/jewel-logo.png"],
      },

      pairs: [
        {
          address: "0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79",
          decimals: 18,
          symbol: "JEWEL",
        },
        {
          address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    {
      pid: 8,
      multiplier: "10",
      depositFees: 3,

      isActive: true,
      isSpecial: false,
      farmDx: "sushiswap",

      stakeToken: {
        address: "0x39be7c95276954a6f7070f9baa38db2123691ed0",
        symbol: "1WBTC/1ETH",
        decimals: 18,
        logo: ["/btc-logo.png", "/eth-logo.png"],
      },

      pairs: [
        {
          address: "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
          decimals: 8,
          symbol: "1WBTC",
        },
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
      ],
    },

    {
      pid: 9,
      multiplier: "10",
      depositFees: 3,

      isActive: true,
      isSpecial: false,
      farmDx: "sushiswap",

      stakeToken: {
        address: "0xeb049f1ed546f8efc3ad57f6c7d22f081ccc7375",
        symbol: "1ETH/WONE",
        decimals: 18,
        logo: ["/eth-logo.png", "/harmony-one-logo.png"],
      },

      pairs: [
        {
          address: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
          decimals: 18,
          symbol: "1ETH",
        },
        {
          address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          decimals: 18,
          symbol: "WONE",
        },
      ],
    },

    {
      pid: 11,
      multiplier: "50",
      depositFees: 0,
      isSpecial: true,
      isActive: true,
      farmDx: "viperswap",

      stakeToken: {
        address: "0xbbdcb6445b06df78db0b67ea3a0a03e16dc59936",
        symbol: "PLTS/1DAI",
        decimals: 18,
        logo: ["/1dai-logo.png", "/plutus-logo.png"],
      },

      pairs: [
        {
          address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
          decimals: 18,
          symbol: "PLTS",
        },
        {
          address: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
          decimals: 18,
          symbol: "1DAI",
        },
      ],
    },
    {
      pid: 13,
      multiplier: "10",
      depositFees: 3,
      isSpecial: false,
      isActive: true,
      farmDx: "sushiswap",

      stakeToken: {
        address: "0x29fc6e830ca8586a68dff325f6d2349fb58be951",
        symbol: "1USDC/FRAX",
        decimals: 18,
        logo: ["/usdc-logo.png", "/frax-logo.png"],
      },

      pairs: [
        {
          address: "0x985458e523db3d53125813ed68c274899e9dfab4",
          decimals: 18,
          symbol: "1USDC",
        },
        {
          address: "0xfa7191d292d5633f702b0bd7e3e3bccc0e633200",
          decimals: 18,
          symbol: "FRAX",
        },
      ],
    },
    {
      pid: 15,
      multiplier: "10",
      depositFees: 3,
      isSpecial: false,
      isActive: true,
      farmDx: "sushiswap",

      stakeToken: {
        address: "0x6b53ca1ed597ed7ccd5664ec9e03329992c2ba87",
        symbol: "stONE/WONE",
        decimals: 18,
        logo: ["/harmony-one-logo.png", "/stone-logo.svg"],
      },

      pairs: [
        {
          address: "0x22d62b19b7039333ad773b7185bb61294f3adc19",
          decimals: 18,
          symbol: "stONE",
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
}[DEFAULT_CHAIN_ID].filter((farm: Farm) => !farm.isDisabled);

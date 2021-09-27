import { DEFAULT_CHAIN_ID } from "./constants";

export type VaultStakeInfo = {
  address: string;
  vaultAddress: string;
  poolSite: string;

  rewardEndBlock?: string;
  isDisabled?: boolean;
  active?: boolean;
  isSpecial?: boolean;

  // lp data
  stakeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string;
    price?: string;
  };

  rewardToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo: string;
    price?: string;
  };

  totalStaked?: string;

  poolShare?: string;
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

export const vaultStakingPools: VaultStakeInfo[] = {
  137: [
    {
      address: "0x7164F49cfA6152119009c600e0c3DA736F6cdC6f",
      vaultAddress: "0xCBd7b263460ad4807dEAdAd3858DE6654f082cA4",
      poolSite: "https://hermesdefi.io/",
      active: true,

      stakeToken: {
        address: "0xcbd7b263460ad4807deadad3858de6654f082ca4",
        symbol: "godIRIS/WMATIC",
        decimals: 18,
        logo: "/hermes-logo-1.png",
      },

      rewardToken: {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        symbol: "WMATIC",
        decimals: 18,
        logo: "/matic-logo.png",
      },
    },

    {
      address: "0x55C105e676BDe6cfaA95dd4A95760afCeAea44f4",
      vaultAddress: "0x75fd7fa818f0d970668dca795b7d79508776a5b1",
      poolSite: "https://kavian.finance",
      active: true,

      stakeToken: {
        address: "0x75fd7fa818f0d970668dca795b7d79508776a5b1",
        symbol: "godKAVIANL2/WMATIC",
        decimals: 18,
        logo: "/kavian-logo.png",
      },

      rewardToken: {
        address: "0x9a33bac266b02faff8fa566c8cb5da08820e28ba",
        symbol: "KAVIANL2",
        decimals: 18,
        logo: "/kavian-logo.png",
      },
    },

    {
      address: "0xf4DE1F2773B94cd898eE67C193fE65D6Ff11B16A",
      vaultAddress: "0x483a58Fd4B023CAE2789cd1E1e5F6F52f93df2C7",
      poolSite: "https://gamma.polypulsar.farm/",
      active: true,

      stakeToken: {
        address: "0x483a58Fd4B023CAE2789cd1E1e5F6F52f93df2C7",
        symbol: "godGBNT/WMATIC",
        decimals: 18,
        logo: "/gbnt-logo.png",
      },

      rewardToken: {
        address: "0x8c9aaca6e712e2193acccbac1a024e09fb226e51",
        symbol: "GBNT",
        decimals: 18,
        logo: "/gbnt-logo.png",
      },
    },

    {
      address: "0x4C9152B6e5Cb375e9Dc0Dcd4A8b9d2a87382CC8f",
      vaultAddress: "0xD4d9a3A705ace962F0813ff0E27c965E1b76357D",
      poolSite: "https://polywise.finance/",
      active: true,

      stakeToken: {
        address: "0xD4d9a3A705ace962F0813ff0E27c965E1b76357D",
        symbol: "godWISE/USDC",
        decimals: 18,
        logo: "/wise-logo.png",
      },

      rewardToken: {
        address: "0x4c19DdeebAF84cA3A255730295AD9d824D4Ff51f",
        symbol: "WISE",
        decimals: 18,
        logo: "/wise-logo.png",
      },
    },

    {
      address: "0xBD47b8f61120b0A963d6e2cA14589901afFBD912",
      vaultAddress: "0x4806743912E5b4Aeb0426671d1F307FC3372642d",
      poolSite: "https://polywise.finance/",
      active: true,

      stakeToken: {
        address: "0x4806743912E5b4Aeb0426671d1F307FC3372642d",
        symbol: "godWISE/WMATIC",
        decimals: 18,
        logo: "/wise-logo.png",
      },

      rewardToken: {
        address: "0x4c19DdeebAF84cA3A255730295AD9d824D4Ff51f",
        symbol: "WISE",
        decimals: 18,
        logo: "/wise-logo.png",
      },
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: VaultStakeInfo) => !p.isDisabled);

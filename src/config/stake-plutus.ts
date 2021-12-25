import { DEFAULT_CHAIN_ID } from "./constants";

export type PlutusStakeInfo = {
  address: string;
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
  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  rewardsEarned?: string;
  userTotalStaked?: string;
};

export const plutusStakingPools: PlutusStakeInfo[] = {
    1666600000: [
    {
      address: "0x6544D6Af6DC69Da88307a198852388c4Dec77e59",
      poolSite: "https://www.harmony.one/",
      active: true,

      stakeToken: {
        address: "0x6c322c67dcab641549066beb849538de3b1f8600",
        symbol: "pPLUTUS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },

      rewardToken: {
        address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
        symbol: "WONE",
        decimals: 18,
        logo: "/harmony-one-logo.png",
      },
    },
    {
      address: "0x98281f1f68c1deabe01582369b2d374046e5fe40",
      poolSite: "https://makerdao.com/en/",
      active: true,

      stakeToken: {
        address: "0x6c322c67dcab641549066beb849538de3b1f8600",
        symbol: "pPLUTUS",
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
  ],
}[DEFAULT_CHAIN_ID].filter((p: PlutusStakeInfo) => !p.isDisabled);
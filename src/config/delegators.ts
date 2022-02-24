import { DEFAULT_CHAIN_ID } from "./constants";

export type DelegatorInfo = {
  address: string;
  masterChefAddress: string;
  delegatorLink?: string;

  active?: boolean;

  rewardToken: {
    address: string;
    symbol: string;
    decimals: number;
    logo?: string;
    price?: string;
  };

  totalStaked?: string;

  apr?: {
    yearlyAPR: number;
    weeklyAPR: number;
    dailyAPR: number;
  };
  userInfo?:{
      rewardBalance: string;
      stakedOne: string;
      stakedIn: number;
      unstakeInfo: {
      };
      canWithdraw: boolean;
      reason?: string;
  }

  hasStaked?: boolean;
  hasApprovedPool?: boolean;
  rewardsEarned?: string;
  userTotalStaked?: string;
};

export const delegatorStakingPools: DelegatorInfo[] = {
  1666600000: [
    {
      address: "0xfd5D64fa2E8F0bC28C8bd0ca8656fcC652cCAF2c",
      masterChefAddress: "0x8c8dca27e450d7d93fa951e79ec354dce543629e",
      delegatorLink:
        "https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5",

      active: true,

      rewardToken: {
        address: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        symbol: "PLTS",
        decimals: 18,
        logo: "/plutus-logo.png",
      },
    },
  ],
}[DEFAULT_CHAIN_ID];

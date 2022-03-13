import { DEFAULT_CHAIN_ID } from "./constants";

export type DelegatorInfo = {
  address: string;
  masterChefAddress: string;
  delegatorLink?: string;

  active?: boolean;

  totalStaked?: string;

  apr?: {
    yearlyAPR: number;
    weeklyAPR: number;
    dailyAPR: number;
  };

  rewardBalance?: string;
  stakedOne?: string;
  stakedIn?: number;
  unstakeInfo?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  canWithdraw?: boolean;
  reason?: string;
  rewardsEarned?: string;
  userTotalStaked?: string;
};

export const delegatorStakingPools: DelegatorInfo[] = {
  1666600000: [
    {
      // address: "0xC0e936D14c5a815642B1b7f342486716E3d6CE9e",
      // address: "0xfd5D64fa2E8F0bC28C8bd0ca8656fcC652cCAF2c",
      address: "0xB0e855B18f2c571bb4709157a97f35E631D750Cb",
      masterChefAddress: "0x8c8dca27e450d7d93fa951e79ec354dce543629e",
      delegatorLink:
        "https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5",

      active: true,
    },
  ],
}[DEFAULT_CHAIN_ID];

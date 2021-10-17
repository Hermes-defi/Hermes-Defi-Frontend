import { DEFAULT_CHAIN_ID } from "./constants";

export type Balancer = {
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
    logo: string;
    price?: string;
  };

  pairs: {
    tokenAddress: string;
    tokenDecimals: number;
    tokenName: string;
  }[];

  balancerAddress?: string;
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

export const balancers: Balancer[] = {
  137: [
    {
      pid: 10,
      multiplier: "15",
      depositFees: 3,

      isActive: false,
      isDisabled: true,
      farmDx: "Balancer",

      stakeToken: {
        address: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42",
        symbol: "U/D/M/U BPT",
        decimals: 18,
        logo: "/USDC__USDT__DAI__miMATIC.png",
      },

      pairs: [
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          tokenDecimals: 6,
          tokenName: "USDC",
        },
        {
          tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          tokenDecimals: 18,
          tokenName: "DAI",
        },
        {
          tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          tokenDecimals: 18,
          tokenName: "DAI",
        },
        {
          tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          tokenDecimals: 6,
          tokenName: "USDT",
        },
      ],

      balancerAddress: "0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000012",
    },
  ],
}[DEFAULT_CHAIN_ID].filter((p: Balancer) => !p.isDisabled);

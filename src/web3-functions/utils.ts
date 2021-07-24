import { BigNumber } from "ethers";

const BLOCKS_PER_YEAR = 15768000;

export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number | string,
  tokenPerBlock: number
): number => {
  const totalRewardPricePerYear = BigNumber.from(rewardTokenPrice)
    .mul(tokenPerBlock)
    .mul(BLOCKS_PER_YEAR);

  const totalStakingTokenInPool = BigNumber.from(stakingTokenPrice).mul(totalStaked);

  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).mul(100);
  return apr.toNumber();
};

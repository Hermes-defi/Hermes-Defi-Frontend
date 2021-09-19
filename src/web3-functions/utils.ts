import BigNumberJS from "bignumber.js";
import { irisPerBlock, secondsPerBlock, secondsPerYear } from "config/constants";

export function compound(r, n = 365, t = 1, c = 1) {
  return (1 + (r * c) / n) ** (n * t) - 1;
}

export function getPoolApr(
  rewardTokenPrice: number,
  poolRewardsPerWeek: number,
  poolTokenPrice: number,
  totalStaked: number
) {
  const rewardPerWeekInUSD = poolRewardsPerWeek * rewardTokenPrice;
  const totalStakedInUSD = totalStaked * poolTokenPrice;
  const weeklyAPR = (rewardPerWeekInUSD / totalStakedInUSD) * 100;
  const dailyAPR = weeklyAPR / 7;
  const yearlyAPR = weeklyAPR * 52;

  return {
    weeklyAPR,
    dailyAPR,
    yearlyAPR,
  };
}

export async function getApy({
  address,
  multiplier,
  totalAllocPoints,
  depositFees,
  stakeTokenPrice,
  totalStakedInFarm,
}: any) {
  const PERFORMANCE_FEE = 0.0075;
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - PERFORMANCE_FEE;
  const BASE_HPY = 4890;

  const poolBlockRewards = new BigNumberJS(irisPerBlock)
    .times(multiplier)
    .dividedBy(totalAllocPoints)
    .times(1 - (depositFees ?? 0));

  const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);
  const yearlyRewardsInUsd = yearlyRewards.times(stakeTokenPrice);

  const totalStakedInUSD = new BigNumberJS(totalStakedInFarm).times(stakeTokenPrice);
  const simpleApr = yearlyRewardsInUsd.dividedBy(totalStakedInUSD);

  const vaultApr = simpleApr.times(SHARE_AFTER_PERFORMANCE_FEE);
  const vaultApy = compound(simpleApr, BASE_HPY, 1, SHARE_AFTER_PERFORMANCE_FEE);

  return {
    yearly: new BigNumberJS(vaultApy).times(100).toString(),
    daily: new BigNumberJS(vaultApr).dividedBy(365).times(100).toString(),
  };
}

export const tokenEarnedPerThousandDollarsCompounding = ({
  numberOfDays,
  farmApr,
  tokenPrice,
  roundingDecimals = 2,
  compoundFrequency = 1,
  performanceFee = 0,
}) => {
  // Everything here is worked out relative to a year, with the asset compounding at the compoundFrequency rate. 1 = once per day
  const timesCompounded = 365 * compoundFrequency;
  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  let aprAsDecimal = farmApr / 100;

  if (performanceFee) {
    // Reduce the APR by the % performance fee
    const feeRelativeToApr = (farmApr / 100) * performanceFee;
    const aprAfterFee = farmApr - feeRelativeToApr;
    aprAsDecimal = aprAfterFee / 100;
  }

  const daysAsDecimalOfYear = numberOfDays / 365;
  // Calculate the starting TOKEN balance with a dollar balance of $1000.
  const principal = 1000 / tokenPrice;
  // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
  const finalAmount =
    principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear);
  // To get the TOKEN amount earned, deduct the amount after compounding (finalAmount) from the starting TOKEN balance (principal)
  const interestEarned = finalAmount - principal;

  return parseFloat(interestEarned.toFixed(roundingDecimals));
};

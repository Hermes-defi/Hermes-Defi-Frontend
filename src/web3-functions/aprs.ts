import BigNumberJS from "bignumber.js";
import { BASE_HPY, blocksPerDay, DFYN_LPF, QUICK_LPF, secondsPerBlock, secondsPerYear } from "config/constants";
import { getUtcSecondsFromDayRange } from "libs/utils";

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

export function compound(r, n = 365, t = 1, c = 1) {
  return (1 + (r * c) / n) ** (n * t) - 1;
}

const getFarmWithTradingFeesApy = ({ farmApr, tradingApr, compoundingsPerYear, t, shareAfterPerformanceFee }) => {
  const farmApy = farmApr ? compound(farmApr, compoundingsPerYear, t, shareAfterPerformanceFee) : 0;
  const tradingApy = tradingApr ? compound(tradingApr, compoundingsPerYear, t, 1) : 0; // no fee on trading
  const finalAPY = (1 + farmApy) * (1 + tradingApy) - 1;
  return finalAPY;
};

async function getTradingFeeApr(address: string, amm: string) {
  try {
    const lpFee = {
      dfyn: DFYN_LPF,
      quickswap: QUICK_LPF,
    };

    const url = {
      dfyn: "https://api.thegraph.com/subgraphs/name/ss-sonic/dfyn-v5",
      quickswap: "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06",
    };

    const [start, end] = getUtcSecondsFromDayRange(1, 2);
    const resp = await fetch(url[amm], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          pairDayDatas(first: 1000, orderBy: date, orderDirection: asc, where: { pairAddress_in: ["${address}"], date_lt: ${end}, date_gt: ${start}}) {
              id
              dailyVolumeUSD
              reserveUSD
            }
          }`,
      }),
    });

    const { data } = await resp.json();
    const pairDayData = data.pairDayDatas[0];

    return new BigNumberJS(pairDayData.dailyVolumeUSD).times(lpFee[amm]).times(365).dividedBy(pairDayData.reserveUSD);
  } catch (err) {
    console.error(err);
    return new BigNumberJS("0");
  }
}

export async function getMasterChefVaultApy({
  address,
  amm,
  multiplier,
  tokenPerBlock,
  totalAllocPoints,
  depositFees,
  performanceFee,
  rewardToken,
  stakeToken,
  totalStakedInFarm,
}) {
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - performanceFee;

  // get trading apr of farm
  const tradingFeeApr = await getTradingFeeApr(address, amm);

  // get farm apr from masterChef
  const totalStakedInUSD = new BigNumberJS(totalStakedInFarm).times(stakeToken.price);
  const poolBlockRewards = new BigNumberJS(tokenPerBlock)
    .times(multiplier)
    .dividedBy(totalAllocPoints)
    .times(1 - (depositFees ?? 0));

  const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);
  const yearlyRewardsInUsd = yearlyRewards.times(rewardToken.price).dividedBy(`1e${rewardToken.decimals}`);
  const simpleApr = yearlyRewardsInUsd.dividedBy(totalStakedInUSD);

  // get the apr breakdown for farm
  const vaultApr = simpleApr.toNumber() * SHARE_AFTER_PERFORMANCE_FEE;
  const vaultApy = compound(simpleApr, BASE_HPY, 1, SHARE_AFTER_PERFORMANCE_FEE);

  // calculate total apy
  const totalApy = getFarmWithTradingFeesApy({
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber(),
    compoundingsPerYear: BASE_HPY,
    t: 1,
    shareAfterPerformanceFee: SHARE_AFTER_PERFORMANCE_FEE,
  });

  return {
    tradingApr: tradingFeeApr.toNumber(),
    vaultApr,
    vaultApy,
    totalApy,
  };
}

export async function getDualVaultApy({
  address,
  amm,
  stakePrice,
  totalStakedInFarm,
  token0RewardRate,
  token0Price,
  token0Decimals,
  token1RewardRate,
  token1Price,
  token1Decimals,
  performanceFee,
}) {
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - performanceFee;

  // get trading apr of farm
  const tradingFeeApr = await getTradingFeeApr(address, amm);

  // get farm apr
  const token0yearlyRewards = new BigNumberJS(token0RewardRate).times(3).times(blocksPerDay).times(365);
  const token0TotalRewardsInUsd = token0yearlyRewards.times(token0Price).dividedBy(`1e${token0Decimals}`);

  const token1yearlyRewards = new BigNumberJS(token1RewardRate).times(3).times(blocksPerDay).times(365);
  const token1TotalRewardsInUsd = token1yearlyRewards.times(token1Price).dividedBy(`1e${token1Decimals}`);

  const totalRewardsInUsd = token0TotalRewardsInUsd.plus(token1TotalRewardsInUsd);
  const totalStakedInUsd = new BigNumberJS(totalStakedInFarm).times(stakePrice);

  const simpleApr = totalRewardsInUsd.dividedBy(totalStakedInUsd);

  // get the apr breakdown for farm
  const vaultApr = simpleApr.toNumber() * SHARE_AFTER_PERFORMANCE_FEE;
  const vaultApy = compound(simpleApr, BASE_HPY, 1, SHARE_AFTER_PERFORMANCE_FEE);

  // calculate total apy
  const totalApy = getFarmWithTradingFeesApy({
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber(),
    compoundingsPerYear: BASE_HPY,
    t: 1,
    shareAfterPerformanceFee: SHARE_AFTER_PERFORMANCE_FEE,
  });

  return {
    tradingApr: tradingFeeApr.toNumber(),
    vaultApr,
    vaultApy,
    totalApy,
  };
}

export async function getRewardPoolVaultApy({
  address,
  amm,
  rewardPoolTotalSupply,
  stakeTokenPrice,
  stakeTokenDecimals,
  rewardRate,
  rewardTokenPrice,
  rewardTokenDecimals,
  performanceFee,
}) {
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - performanceFee;

  // get trading apr of farm
  const tradingFeeApr = await getTradingFeeApr(address, amm);

  // get farm apr
  const totalStakedInUsd = new BigNumberJS(rewardPoolTotalSupply)
    .times(stakeTokenPrice)
    .dividedBy(`1e${stakeTokenDecimals}`);
  const yearlyRewards = new BigNumberJS(rewardRate).times(secondsPerYear);
  const yearlyRewardsInUsd = yearlyRewards.times(rewardTokenPrice).dividedBy(rewardTokenDecimals);

  const simpleApr = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);

  // get the apr breakdown for farm
  const vaultApr = simpleApr.toNumber() * SHARE_AFTER_PERFORMANCE_FEE;
  const vaultApy = compound(simpleApr, BASE_HPY, 1, SHARE_AFTER_PERFORMANCE_FEE);

  // calculate total apy
  const totalApy = getFarmWithTradingFeesApy({
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber(),
    compoundingsPerYear: BASE_HPY,
    t: 1,
    shareAfterPerformanceFee: SHARE_AFTER_PERFORMANCE_FEE,
  });

  return {
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber() * 100,
    vaultApr,
    vaultApy,
    totalApy,
  };
}

export async function getDualRewardPoolVaultApy({
  address,
  amm,
  rewardPoolTotalSupply,
  stakeTokenPrice,
  stakeTokenDecimals,
  rewardRateA,
  rewardTokenAPrice,
  rewardTokenADecimals,
  rewardRateB,
  rewardTokenBPrice,
  rewardTokenBDecimals,
  performanceFee,
}) {
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - performanceFee;

  // get trading apr of farm
  const tradingFeeApr = await getTradingFeeApr(address, amm);

  // get farm apr
  const totalStakedInUsd = new BigNumberJS(rewardPoolTotalSupply)
    .times(stakeTokenPrice)
    .dividedBy(`1e${stakeTokenDecimals}`);

  const yearlyRewardsA = new BigNumberJS(rewardRateA).times(secondsPerYear);
  const yearlyRewardsAInUsd = yearlyRewardsA.times(rewardTokenAPrice).dividedBy(rewardTokenADecimals);

  const yearlyRewardsB = new BigNumberJS(rewardRateB).times(secondsPerYear);
  const yearlyRewardsBInUsd = yearlyRewardsB.times(rewardTokenBPrice).dividedBy(rewardTokenBDecimals);

  const yearlyRewardsInUsd = yearlyRewardsAInUsd.plus(yearlyRewardsBInUsd);
  const simpleApr = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);

  // get the apr breakdown for farm
  const vaultApr = simpleApr.toNumber() * SHARE_AFTER_PERFORMANCE_FEE;
  const vaultApy = compound(simpleApr, BASE_HPY, 1, SHARE_AFTER_PERFORMANCE_FEE);

  // calculate total apy
  const totalApy = getFarmWithTradingFeesApy({
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber(),
    compoundingsPerYear: BASE_HPY,
    t: 1,
    shareAfterPerformanceFee: SHARE_AFTER_PERFORMANCE_FEE,
  });

  return {
    farmApr: simpleApr.toNumber(),
    tradingApr: tradingFeeApr.toNumber() * 100,
    vaultApr,
    vaultApy,
    totalApy,
  };
}

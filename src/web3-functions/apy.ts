import BigNumberJS from "bignumber.js";
import { irisPerBlock, secondsPerBlock, secondsPerYear } from "config/constants";
import { utils } from "ethers";
import { compound } from "./utils";

async function getTradingFeeApr(address: string, lpFee: number) {
  try {
    const resp = await fetch("https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          pairDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { pairAddress: "${address}" }) {
            id
            dailyVolumeUSD
            reserveUSD
          }
        }`,
      }),
    });

    const { data } = await resp.json();
    const pairDayData = data.pairDayDatas[0];

    return new BigNumberJS(pairDayData.dailyVolumeUSD)
      .times(lpFee)
      .times(365)
      .dividedBy(pairDayData.reserveUSD);
  } catch (err) {
    console.log(err);
    return new BigNumberJS("0");
  }
}

const getFarmWithTradingFeesApy = ({
  farmApr,
  tradingApr,
  compoundingsPerYear,
  t,
  shareAfterBeefyPerformanceFee,
}) => {
  const farmApy = farmApr
    ? compound(farmApr, compoundingsPerYear, t, shareAfterBeefyPerformanceFee)
    : 0;
  const tradingApy = tradingApr ? compound(tradingApr, compoundingsPerYear, t, 1) : 0; // no fee on trading
  const finalAPY = (1 + farmApy) * (1 + tradingApy) - 1;
  return finalAPY;
};

export async function getApy({
  address,
  multiplier,
  totalAllocPoints,
  depositFees,
  irisTokenPrice,
  stakeTokenPrice,
  totalStakedInFarm,
}: any) {
  const BASE_HPY = 4890;
  const QUICK_LPF = 0.0025;
  const PERFORMANCE_FEE = 0.0075;
  const SHARE_AFTER_PERFORMANCE_FEE = 1 - PERFORMANCE_FEE;

  // get trading apr of farm
  const tradingFeeApr = await getTradingFeeApr(address, QUICK_LPF);

  // get farm apr from masterChef
  const totalStakedInUSD = new BigNumberJS(totalStakedInFarm).times(stakeTokenPrice);
  const poolBlockRewards = new BigNumberJS(utils.parseEther(`${irisPerBlock}`).toString())
    .times(multiplier)
    .dividedBy(totalAllocPoints)
    .times(1 - (depositFees ?? 0));

  const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);
  const yearlyRewardsInUsd = yearlyRewards.times(irisTokenPrice).dividedBy("1e18");

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
    shareAfterBeefyPerformanceFee: SHARE_AFTER_PERFORMANCE_FEE,
  });

  return {
    tradingApr: tradingFeeApr.toNumber(),
    vaultApr,
    vaultApy,
    totalApy,
  };
}

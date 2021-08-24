import defaultContracts from "config/contracts";
import ERC20_ABI from "config/abis/ERC20.json";
import BigNumberJS from "bignumber.js";
import { BurnAddress, DEFAULT_CHAIN_ID, irisPerBlock } from "config/constants";
import { BigNumber, ethers, utils } from "ethers";
import { Token } from "quickswap-sdk";
import { RPC_URLS } from "wallet/connectors";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { balancersDefaultData, farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";
import { getPoolApr } from "web3-functions/utils";

const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[DEFAULT_CHAIN_ID]);

const irisContract = new ethers.Contract(
  defaultContracts.irisToken.address,
  defaultContracts.irisToken.abi,
  provider
);

const masterChef = new ethers.Contract(
  defaultContracts.masterChef.address,
  defaultContracts.masterChef.abi,
  provider
);

export async function getIrisPrice() {
  const irisPrice = await fetchPrice(
    new Token(DEFAULT_CHAIN_ID, defaultContracts.irisToken.address, 18, "IRIS"),
    provider
  );

  return irisPrice;
}

export async function getIrisStats(irisPrice: string) {
  const maximumSupply = 1_000_000;
  const totalMinted = (await irisContract.totalSupply()) as BigNumber;
  const totalBurned = (await irisContract.balanceOf(BurnAddress)) as BigNumber;

  const circulatingSupply = totalMinted.sub(totalBurned);

  let marketCap = "N/A";
  if (irisPrice) {
    // convert circulating supply to real price
    const circulatingSupplyInIris = utils.formatEther(circulatingSupply);
    marketCap = new BigNumberJS(circulatingSupplyInIris)
      .multipliedBy(irisPrice as string)
      .toString();
  }

  return {
    maximumSupply,
    marketCap,
    totalMinted: utils.formatEther(totalMinted),
    totalBurned: utils.formatEther(totalBurned),
    circulatingSupply: utils.formatEther(circulatingSupply),
  };
}

export async function getAPRStats(irisPrice: string) {
  const farmAprsPromise = farmsDefaultData.map(async (pool) => {
    const lpContract = new ethers.Contract(pool.lpAddress, ERC20_ABI, provider);

    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    const totalSupply = utils.formatUnits(await lpContract.totalSupply(), pool.decimals);

    const token0 = new Token(
      DEFAULT_CHAIN_ID,
      pool.pairTokens[0].tokenAddress,
      pool.pairTokens[0].tokenDecimals,
      pool.pairTokens[0].tokenName
    );

    const token1 = new Token(
      DEFAULT_CHAIN_ID,
      pool.pairTokens[1].tokenAddress,
      pool.pairTokens[1].tokenDecimals,
      pool.pairTokens[1].tokenName
    );

    const tokenPrice = await fetchPairPrice(token0, token1, totalSupply, provider);

    const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(pool.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    // GET APY
    const apr = getPoolApr(
      parseFloat(irisPrice || "0"),
      poolRewardsPerWeek,
      parseFloat(tokenPrice || "0"),
      parseFloat(utils.formatUnits(totalLpStaked, pool.decimals) || "0")
    );

    return apr.yearlyAPR;
  });

  const poolAprsPromise = poolDefaultData.map(async (pool) => {
    const lpContract = new ethers.Contract(pool.lpAddress, ERC20_ABI, provider);
    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);

    const token = new Token(DEFAULT_CHAIN_ID, pool.lpAddress, pool.decimals, pool.lpToken);
    const tokenPrice = await fetchPrice(token, provider);

    const rewardsPerWeek = irisPerBlock * (604800 / 2.1);
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(pool.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    // GET APY
    const apr = getPoolApr(
      parseFloat(irisPrice || "0"),
      poolRewardsPerWeek,
      parseFloat(tokenPrice || "0"),
      parseFloat(utils.formatUnits(totalLpStaked, pool.decimals) || "0")
    );

    return apr.yearlyAPR;
  });

  const farmsAPR = await Promise.all(farmAprsPromise);
  const poolAPR = await Promise.all(poolAprsPromise);

  return { farm: farmsAPR, pool: poolAPR };
}

export async function getHermesStats() {
  const totalValueInPools = await poolDefaultData.reduce(
    async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
      const lpContract = new ethers.Contract(pool.lpAddress, ERC20_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const tokenDecimal = await lpContract.decimals();
      const tokenSymbol = await lpContract.symbol();

      const token = new Token(DEFAULT_CHAIN_ID, lpContract.address, tokenDecimal, tokenSymbol);
      const tokenPrice = await fetchPrice(token, provider);

      const total = await _total;
      const poolPrice = new BigNumberJS(
        utils.formatUnits(totalLpStaked, tokenDecimal)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  const totalValueInFarms = await farmsDefaultData.reduce(
    async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
      const lpContract = new ethers.Contract(pool.lpAddress, ERC20_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const totalSupply = utils.formatUnits(await lpContract.totalSupply(), pool.decimals);

      const token0 = new Token(
        DEFAULT_CHAIN_ID,
        pool.pairTokens[0].tokenAddress,
        pool.pairTokens[0].tokenDecimals,
        pool.pairTokens[0].tokenName
      );

      const token1 = new Token(
        DEFAULT_CHAIN_ID,
        pool.pairTokens[1].tokenAddress,
        pool.pairTokens[1].tokenDecimals,
        pool.pairTokens[1].tokenName
      );

      const tokenPrice = await fetchPairPrice(token0, token1, totalSupply, provider);

      const total = await _total;
      const poolPrice = new BigNumberJS(
        utils.formatUnits(totalLpStaked, pool.decimals)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  const totalValueInBalancers = await balancersDefaultData.reduce(
    async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
      const lpContract = new ethers.Contract(pool.lpAddress, ERC20_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const tokenDecimal = await lpContract.decimals();

      const tokenPrice = await fetchBalancerPrice(pool.balancerAddress);

      const total = await _total;
      const poolPrice = new BigNumberJS(
        utils.formatUnits(totalLpStaked, tokenDecimal)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  const tvl = totalValueInPools.plus(totalValueInFarms).plus(totalValueInBalancers);

  return {
    totalValueInPools: totalValueInPools.toString(),
    totalValueInFarms: totalValueInFarms.plus(totalValueInBalancers).toString(),
    totalValueInBalancers: totalValueInBalancers.toString(),
    tvl: tvl.toString(),
  };
}

export async function loadHomePageData() {
  // load iris price
  const irisPrice = await getIrisPrice();

  // load iris stats
  const irisStats = await getIrisStats(irisPrice);

  // load apr data
  const aprData = await getAPRStats(irisPrice);

  // load hermes stats
  const hermesData = await getHermesStats();

  return { irisPrice, irisStats, aprData, hermesData };
}

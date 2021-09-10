import defaultContracts from "config/contracts";
import ERC20_ABI from "config/abis/ERC20.json";
import BigNumberJS from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { ethers, utils } from "ethers";
import { Token } from "quickswap-sdk";
import { RPC_URLS } from "wallet/connectors";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";

import { Pool, pools } from "config/pools";
import { Farm, farms } from "config/farms";
import { Balancer, balancers } from "config/balancers";

const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[DEFAULT_CHAIN_ID]);

export async function getIrisPrice() {
  const irisPrice = await fetchPrice(
    new Token(DEFAULT_CHAIN_ID, defaultContracts.irisToken.address, 18, "IRIS"),
    provider
  );

  return irisPrice;
}

export async function getHermesStats() {
  const totalValueInPools = await pools.reduce(async (_total: Promise<BigNumberJS>, pool: Pool) => {
    const lpContract = new ethers.Contract(pool.stakeToken.address, ERC20_ABI, provider);

    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    const tokenDecimal = await lpContract.decimals();
    const tokenSymbol = await lpContract.symbol();

    const token = new Token(DEFAULT_CHAIN_ID, lpContract.address, tokenDecimal, tokenSymbol);
    const tokenPrice = await fetchPrice(token, provider);

    const total = await _total;
    const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, tokenDecimal)).multipliedBy(
      tokenPrice
    );

    return total.plus(poolPrice);
  }, Promise.resolve(new BigNumberJS(0)));

  const totalValueInFarms = await farms.reduce(async (_total: Promise<BigNumberJS>, farm: Farm) => {
    const lpContract = new ethers.Contract(farm.stakeToken.address, ERC20_ABI, provider);

    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    const totalSupply = utils.formatUnits(await lpContract.totalSupply(), farm.stakeToken.decimals);

    const token0 = new Token(
      DEFAULT_CHAIN_ID,
      farm.pairs[0].tokenAddress,
      farm.pairs[0].tokenDecimals,
      farm.pairs[0].tokenName
    );

    const token1 = new Token(
      DEFAULT_CHAIN_ID,
      farm.pairs[1].tokenAddress,
      farm.pairs[1].tokenDecimals,
      farm.pairs[1].tokenName
    );

    const tokenPrice = await fetchPairPrice(token0, token1, totalSupply, provider);

    const total = await _total;
    const poolPrice = new BigNumberJS(
      utils.formatUnits(totalLpStaked, farm.stakeToken.decimals)
    ).multipliedBy(tokenPrice);

    return total.plus(poolPrice);
  }, Promise.resolve(new BigNumberJS(0)));

  const totalValueInBalancers = await balancers.reduce(
    async (_total: Promise<BigNumberJS>, bal: Balancer) => {
      const lpContract = new ethers.Contract(bal.stakeToken.address, ERC20_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const tokenDecimal = await lpContract.decimals();

      const tokenPrice = await fetchBalancerPrice(bal.balancerAddress);

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
    totalValueInFarms: totalValueInFarms.toString(),
    totalValueInBalancers: totalValueInBalancers.toString(),
    tvl: tvl.toString(),
  };
}

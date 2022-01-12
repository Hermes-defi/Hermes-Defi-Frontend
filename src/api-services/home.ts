import defaultContracts from "config/contracts";
import ERC20_ABI from "config/abis/ERC20.json";
import VAULT_ABI from "config/abis/Vault.json";
import BANK_ABI from "config/abis/StakeBank.json";
import BigNumberJS from "bignumber.js";
import { ethers, utils } from "ethers";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";

import simpleRpcProvider from 'libs/providers';
import { Pool, pools } from "config/pools";
import { Farm, farms } from "config/farms";
import { Balancer, balancers } from "config/balancers";
import { vaults, Vault } from "config/vaults";
import { StakeBankInfo, stakingBankPools } from "config/stake-bank";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { RPC_URLS } from "wallet/connectors";

const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[DEFAULT_CHAIN_ID]);

export async function getPlutusPrice() {
  const plutusPrice = await fetchPrice(
    { address: defaultContracts.plutusToken.address, decimals: 18, symbol: "PLUTUS" },
    provider
  );

  return plutusPrice;
}

export async function getHermesStats() {
  const totalValueInPools = await pools.reduce(async (_total: Promise<BigNumberJS>, pool: Pool) => {
    const lpContract = new ethers.Contract(pool.stakeToken.address, ERC20_ABI, provider);

    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    const tokenDecimal = await lpContract.decimals();
    const tokenSymbol = await lpContract.symbol();

    const tokenPrice = await fetchPrice(
      { address: lpContract.address, decimals: tokenDecimal, symbol: tokenSymbol },
      provider
    );

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

    const tokenPrice = await fetchPairPrice(
      farm.pairs[0],
      farm.pairs[1],
      totalSupply,
      provider,
      farm.farmDx
    );

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

  const totalValueInVaults = await vaults.reduce(
    async (_total: Promise<BigNumberJS>, vault: Vault) => {
      const vaultContract = new ethers.Contract(vault.address, VAULT_ABI, provider);
      const lpContract = new ethers.Contract(vault.stakeToken.address, ERC20_ABI, provider);

      const totalLpStaked = await vaultContract.balance();
      const totalSupply = utils.formatUnits(
        await lpContract.totalSupply(),
        vault.stakeToken.decimals
      );

      const tokenPrice = await fetchPairPrice(
        vault.pairs[0],
        vault.pairs[1],
        totalSupply,
        provider,
        vault.amm
      );

      const total = await _total;
      const poolPrice = new BigNumberJS(
        utils.formatUnits(totalLpStaked, vault.stakeToken.decimals)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  const tvl = totalValueInPools
    .plus(totalValueInFarms)
    .plus(totalValueInBalancers)
    .plus(totalValueInVaults);

  return {
    totalValueInPools: totalValueInPools.toString(),
    totalValueInFarms: totalValueInFarms.toString(),
    totalValueInBalancers: totalValueInBalancers.toString(),
    totalValueInVaults: totalValueInVaults.toString(),
    tvl: tvl.toString(),
  };
}

export async function getPlutusStats() {
  const totalValueInPools = await pools
    .filter((pool) => !pool.vaultPool)
    .reduce(async (_total: Promise<BigNumberJS>, pool: Pool) => {
      const lpContract = new ethers.Contract(pool.stakeToken.address, ERC20_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const tokenDecimal = await lpContract.decimals();
      const tokenSymbol = await lpContract.symbol();

      const tokenPrice = await fetchPrice(
        { address: lpContract.address, decimals: tokenDecimal, symbol: tokenSymbol },
        provider
      );

      const total = await _total;
      const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, tokenDecimal)).multipliedBy(tokenPrice);
      console.log({
        stakeToken: pool.stakeToken.symbol,
        poolPrice: poolPrice
      })
      return total.plus(poolPrice);
    }, Promise.resolve(new BigNumberJS(0)));

  const totalValueInFarms = await farms.reduce(async (_total: Promise<BigNumberJS>, farm: Farm) => {
    const lpContract = new ethers.Contract(farm.stakeToken.address, ERC20_ABI, provider);

    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    const totalSupply = utils.formatUnits(await lpContract.totalSupply(), farm.stakeToken.decimals);

    const tokenPrice = await fetchPairPrice(farm.pairs[0], farm.pairs[1], totalSupply, provider, farm.farmDx);

    const total = await _total;
    const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, farm.stakeToken.decimals)).multipliedBy(
      tokenPrice
    );

    return total.plus(poolPrice);
  }, Promise.resolve(new BigNumberJS(0)));

  const totalValueInBank = await stakingBankPools.reduce(async (_total: Promise<BigNumberJS>, bank: StakeBankInfo) => {
    const lpContract = new ethers.Contract(bank.stakeToken.address, ERC20_ABI, provider);
    const bankContract = new ethers.Contract(bank.address, BANK_ABI, provider);
    const totalLpStaked = await bankContract.totalStaked();

    const tokenPrice = await fetchPrice(
      { address: lpContract.address, decimals: bank.stakeToken.decimals, symbol: bank.stakeToken.symbol },
      provider
    );

    const total = await _total;
    const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, bank.stakeToken.decimals)).multipliedBy(
      tokenPrice
    );

    return total.plus(poolPrice);
  }, Promise.resolve(new BigNumberJS(0)));

  

  // const totalValueInBalancers = await balancers.reduce(async (_total: Promise<BigNumberJS>, bal: Balancer) => {
  //   const lpContract = new ethers.Contract(bal.stakeToken.address, ERC20_ABI, provider);

  //   const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
  //   const tokenDecimal = await lpContract.decimals();

  //   const tokenPrice = await fetchBalancerPrice(bal.balancerAddress);

  //   const total = await _total;
  //   const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, tokenDecimal)).multipliedBy(tokenPrice);

  //   return total.plus(poolPrice);
  // }, Promise.resolve(new BigNumberJS(0)));

  // const totalValueInVaults = await vaults.reduce(async (_total: Promise<BigNumberJS>, vault: Vault) => {
  //   const vaultContract = new ethers.Contract(vault.address, VAULT_ABI, provider);
  //   const lpContract = new ethers.Contract(vault.stakeToken.address, ERC20_ABI, provider);

  //   const totalLpStaked = await vaultContract.balance();
  //   const totalSupply = utils.formatUnits(await lpContract.totalSupply(), vault.stakeToken.decimals);

  //   const tokenPrice = await fetchPairPrice(vault.pairs[0], vault.pairs[1], totalSupply, provider, vault.amm);

  //   const total = await _total;
  //   const poolPrice = new BigNumberJS(utils.formatUnits(totalLpStaked, vault.stakeToken.decimals)).multipliedBy(
  //     tokenPrice
  //   );

  //   return total.plus(poolPrice);
  // }, Promise.resolve(new BigNumberJS(0)));

  const tvl = totalValueInPools
    .plus(totalValueInFarms)
    .plus(totalValueInBank);
    // .plus(totalValueInVaults);

  return {
    totalValueInPools: totalValueInPools.toString(),
    totalValueInFarms: totalValueInFarms.toString(),
    totalValueInBank: totalValueInBank.toString(),
    // totalValueInBalancers: totalValueInBalancers.toString(),
    // totalValueInVaults: totalValueInVaults.toString(),
    tvl: tvl.toString(),
  };
}

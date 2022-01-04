import defaultContracts from "config/contracts";
import ERC20_ABI from "config/abis/ERC20.json";
import VAULT_ABI from "config/abis/Vault.json";
import STAKE_ABI from "config/abis/StakePool.json";
import BigNumberJS from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { ethers, utils } from "ethers";
import { RPC_URLS } from "wallet/connectors";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";

import { Pool, pools } from "config/pools";
import { Farm, farms } from "config/farms";
import { Balancer, balancers } from "config/balancers";
import { vaults, Vault } from "config/vaults";
import { StakeInfo, stakingPools } from "config/stake";

const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[DEFAULT_CHAIN_ID]);

export async function getIrisPrice() {
  const irisPrice = await fetchPrice(
    { address: defaultContracts.irisToken.address, decimals: 18, symbol: "IRIS" },
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

  const totalValueInStakePools = await stakingPools.reduce(async (_total: Promise<BigNumberJS>, stakePool: StakeInfo) => {
    const lpContract = new ethers.Contract(stakePool.stakeToken.address, ERC20_ABI, provider);
    const stakePoolContract = new ethers.Contract(stakePool.address, STAKE_ABI, provider);

    const totalLpStaked = await stakePoolContract.totalStakeTokenBalance();
    const totalSupply = utils.formatUnits(await lpContract.totalSupply(), stakePool.stakeToken.decimals);
    let tokenPrice = 0;
    if(stakePool.stakeToken.isLp){
      tokenPrice = await fetchPairPrice(
        stakePool.stakeToken.pairs[0],
        stakePool.stakeToken.pairs[1],
        totalSupply,
        provider,
        stakePool.stakeToken.farmDx
      );
    }
    else{
      tokenPrice = await fetchPrice(
        { address: lpContract.address, decimals: stakePool.stakeToken.decimals, symbol: stakePool.stakeToken.symbol },
        provider
      );
    }

    const total = await _total;
    const poolPrice = new BigNumberJS(
      utils.formatUnits(totalLpStaked, stakePool.stakeToken.decimals)
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
    // .plus(totalValueInStakePools);

  return {
    totalValueInPools: totalValueInPools.toString(),
    totalValueInFarms: totalValueInFarms.toString(),
    totalValueInBalancers: totalValueInBalancers.toString(),
    totalValueInVaults: totalValueInVaults.toString(),
    // totalValueInStakePools: totalValueInStakePools.toString(),
    tvl: tvl.toString(),
  };
}

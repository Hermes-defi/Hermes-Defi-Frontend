import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import defaultContracts from "config/contracts";
import vaultAbi from "config/abis/Vault.json";
import miniChefAbi from "config/abis/MiniChefSushi.json";
import uniPairAbi from "config/abis/UNIPAIR.json";
import BigNumberJS from "bignumber.js";
import { vaults } from "config/vaults";
import { simpleRpcProvider as provider } from "libs/providers";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { getVaultApy } from "web3-functions/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const masterChef = new ethers.Contract(defaultContracts.masterChef.address, defaultContracts.masterChef.abi, provider);

  try {
    switch (method) {
      case "GET": {
        const { vaultAddress } = query;

        const vault = vaults.find((v) => v.address === vaultAddress);

        const vaultContract = new ethers.Contract(vault.address, vaultAbi, provider);
        vault.totalStaked = ethers.utils.formatUnits(await vaultContract.balance(), vault.stakeToken.decimals);

        // get prices
        const lpContract = new ethers.Contract(vault.stakeToken.address, uniPairAbi, provider);
        const totalSupply = ethers.utils.formatUnits(await lpContract.totalSupply(), vault.stakeToken.decimals);

        vault.stakeToken.price = await fetchPairPrice(vault.pairs[0], vault.pairs[1], totalSupply, provider, vault.amm);

        if (vault.isActive) {
          const miniChef = new ethers.Contract(vault.masterChefAddress, miniChefAbi, provider);
          vault.sushiRewardTokens[0].price = await fetchPrice(vault.sushiRewardTokens[0], provider);
          vault.sushiRewardTokens[1].price = await fetchPrice(vault.sushiRewardTokens[1], provider);

          // caculate apy
          const totalAllocPoints = (await miniChef.totalAllocPoint()).toNumber();
          const farmInfo = await miniChef.poolInfo(vault.farmPid);
          const multiplier = farmInfo.allocPoint.toNumber();

          //* NO DEPOSIT FEES
          // const depositFees = BigNumber.from(farmInfo.depositFeeBP).div(100).toNumber();
          const totalStakedInFarm = ethers.utils.formatUnits(await lpContract.balanceOf(miniChef.address), await lpContract.decimals());

          //* ESPECIFIC 4 SUSHI VAULTS
          const sushiPerSecond = (await miniChef.sushiPerSecond()).toString();

          const apy = await getVaultApy({
            address: lpContract.address,
            multiplier,
            tokenPerBlock: sushiPerSecond,
            totalAllocPoints,
            depositFees: 0,
            performanceFee: vault.performanceFee,
            rewardToken: vault.sushiRewardTokens,
            stakeToken: vault.stakeToken,
            totalStakedInFarm,
          });

          vault.apy = {
            yearly: apy.vaultApy * 100,
            daily: (apy.vaultApr / 365) * 100,
          };
        } else {
          vault.apy = {
            yearly: 0,
            daily: 0,
          };
        }

        vault.totalStakedInUSD = new BigNumberJS(vault.totalStaked).times(vault.stakeToken.price || 0).toString();
        if (vault.rewardToken.poolId) {
          const pricePerShare = ethers.utils.formatUnits(await vaultContract.getPricePerFullShare(), 18);
          const extraDepositedInPool = ethers.utils.formatUnits(await vaultContract.balanceOf(masterChef.address), 18);

          const depositTokenPrice = await fetchPairPrice(vault.pairs[0], vault.pairs[1], totalSupply, provider, vault.amm);
          const depositTokenStaked = new BigNumberJS(extraDepositedInPool);
          const depositTokenStakedInUsd = depositTokenStaked.times(depositTokenPrice).times(pricePerShare);

          vault.totalStakedInUSD = new BigNumberJS(vault.totalStakedInUSD).plus(depositTokenStakedInUsd).toString();
        }

        return res.status(200).send(vault);
      }
      default: {
        throw new Error("Method not allowed");
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}

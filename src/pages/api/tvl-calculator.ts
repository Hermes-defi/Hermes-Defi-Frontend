import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";
import AWS from "aws-sdk";

import * as ethers from "ethers";
import BigNumberJS from "bignumber.js";

import defaultContracts from "config/contracts";
import ERC20_ABI from "config/abis/ERC20.json";
import UNIPAIR_ABI from "config/abis/UNIPAIR.json";
import { RPC_URLS } from "wallet/connectors";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { farmsDefaultData, poolDefaultData, PoolInfo } from "config/pools";

import { Token } from "quickswap-sdk";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";

const s3 = new AWS.S3({
  accessKeyId: process.env.HERMES_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.HERMES_AWS_SECRET_KEY_ID,
});

async function calculateTVL() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[DEFAULT_CHAIN_ID]);

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
        ethers.utils.formatUnits(totalLpStaked, tokenDecimal)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  const totalValueInFarms = await farmsDefaultData.reduce(
    async (_total: Promise<BigNumberJS>, pool: PoolInfo) => {
      const lpContract = new ethers.Contract(pool.lpAddress, UNIPAIR_ABI, provider);

      const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
      const totalSupply = ethers.utils.formatUnits(await lpContract.totalSupply(), pool.decimals);

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
        ethers.utils.formatUnits(totalLpStaked, pool.decimals)
      ).multipliedBy(tokenPrice);

      return total.plus(poolPrice);
    },
    Promise.resolve(new BigNumberJS(0))
  );

  return totalValueInPools.plus(totalValueInFarms).toFixed(2).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        const tvlJSON = await s3
          .getObject({ Bucket: "bucketforhermes", Key: "chartData.json" })
          .promise();

        // perse json
        const tvlData: any[] = tvlJSON.Body ? JSON.parse(tvlJSON.Body.toString()) : [];

        // push the new tvl to the array
        const currentTime = dayjs().toISOString();
        const tvl = await calculateTVL();

        tvlData.push({ time: currentTime, value: tvl });

        if (tvlData.length === 12) {
          tvlData.shift();
        }

        // write new json to file
        await s3
          .upload({
            Bucket: "bucketforhermes",
            Key: "chartData.json",
            Body: JSON.stringify(tvlData),
          })
          .promise();

        return res.send(tvlData);
      } catch (e) {
        return res.send(e.message);
      }
    }
    default: {
      return res.status(404).send("Page not found");
    }
  }
}

import defaultContracts from "config/contracts";
import BigNumberJS from "bignumber.js";
import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID } from "config/constants";
import { BigNumber, utils } from "ethers";
import { PoolInfo } from "config/pools";
import { useActiveWeb3React } from "wallet";
import { useERC20, useMasterChef, useStakePoolContract, useUniPair } from "../contracts";
import { useCallback } from "react";
import { getPoolApr } from "web3-functions/utils";
import { fetchBalancerPrice, fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { StakeInfo } from "config/stake";
import { useCurrentBlockNumber } from "hooks/wallet";

const IRIS_PER_BLOCK = 0.4;
export function useFetchPoolData(irisPrice: string) {
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const getPairContract = useUniPair();
  const { account, library } = useActiveWeb3React();

  const fetchData = useCallback(
    async (poolInfo: PoolInfo) => {
      try {
        // fetch data from contract
        let masterChefInfo = await masterChef.poolInfo(poolInfo.pid);

        // override data with contract data
        poolInfo.multiplier = masterChefInfo.allocPoint.toString();
        poolInfo.active = masterChefInfo.allocPoint.toString() !== "0";
        poolInfo.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();
        poolInfo.lpAddress = masterChefInfo.lpToken;
      } catch (e) {
        //  if we can't fetch pool data then use the default data
        return poolInfo;
      }

      // TOKEN/PAIR DATA
      let lpContract = getLpContract(poolInfo.lpAddress);
      poolInfo.totalStaked = utils.formatUnits(
        await lpContract.balanceOf(defaultContracts.masterChef.address),
        poolInfo.decimals
      );

      // TOKEN PRICE
      if (poolInfo.isFarm) {
        lpContract = getPairContract(poolInfo.lpAddress);

        const totalSupply = utils.formatUnits(await lpContract.totalSupply(), poolInfo.decimals);

        const token0 = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.pairTokens[0].tokenAddress,
          poolInfo.pairTokens[0].tokenDecimals,
          poolInfo.pairTokens[0].tokenName
        );

        const token1 = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.pairTokens[1].tokenAddress,
          poolInfo.pairTokens[1].tokenDecimals,
          poolInfo.pairTokens[1].tokenName
        );

        poolInfo.price = await fetchPairPrice(token0, token1, totalSupply, library);
      } else if (poolInfo.isBalancer) {
        poolInfo.price = await fetchBalancerPrice(poolInfo.balancerAddress);
      } else {
        poolInfo.token = new Token(
          DEFAULT_CHAIN_ID,
          poolInfo.lpAddress,
          poolInfo.decimals,
          poolInfo.lpToken
        );

        // TOKEN PRICE
        poolInfo.price = await fetchPrice(poolInfo.token, library);
      }

      // APR
      const rewardsPerWeek = IRIS_PER_BLOCK * (604800 / 2.1);
      const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

      const poolRewardsPerWeek = new BigNumberJS(poolInfo.multiplier)
        .div(totalAllocPoints)
        .times(rewardsPerWeek)
        .toNumber();

      // GET APY
      const apr = getPoolApr(
        parseFloat(irisPrice || "0"),
        poolRewardsPerWeek,
        parseFloat(poolInfo.price || "0"),
        parseFloat(poolInfo.totalStaked || "0")
      );

      poolInfo.apr = apr;

      if (account) {
        poolInfo.irisEarned = utils.formatEther(
          await masterChef.pendingIris(poolInfo.pid, account)
        );
        const userInfo = await masterChef.userInfo(poolInfo.pid, account);

        poolInfo.lpStaked = utils.formatUnits(userInfo.amount, poolInfo.decimals);
        poolInfo.hasStaked = !(userInfo.amount as BigNumber).isZero();

        const allowance: BigNumber = await lpContract.allowance(
          account,
          defaultContracts.masterChef.address
        );
        poolInfo.hasApprovedPool = !allowance.isZero();
      }

      return poolInfo;
    },
    [account, library, irisPrice]
  );

  return fetchData;
}

export function useFetchStakePoolData() {
  const getLpContract = useERC20();
  const getStakePoolContract = useStakePoolContract();
  const currentBlock = useCurrentBlockNumber();
  const { account, library } = useActiveWeb3React();

  const fetchData = useCallback(
    async (stakePoolInfo: StakeInfo) => {
      try {
        const poolChef = getStakePoolContract(stakePoolInfo.address);
        const endBlock = await poolChef.bonusEndBlock();

        stakePoolInfo.rewardEndBlock = endBlock.toString();
        stakePoolInfo.active = endBlock.sub(currentBlock || 0).gt(0);

        const totalStaked = (await poolChef.totalStakeTokenBalance()).toString();

        stakePoolInfo.totalStaked = utils.formatUnits(
          totalStaked,
          stakePoolInfo.stakeToken.decimal
        );

        // get prices
        const stakingToken = new Token(
          DEFAULT_CHAIN_ID,
          stakePoolInfo.stakeToken.address,
          stakePoolInfo.stakeToken.decimal,
          stakePoolInfo.stakeToken.symbol
        );

        const rewardToken = new Token(
          DEFAULT_CHAIN_ID,
          stakePoolInfo.rewardToken.address,
          stakePoolInfo.rewardToken.decimal,
          stakePoolInfo.rewardToken.symbol
        );

        // TOKEN PRICE
        stakePoolInfo.stakeToken.price = await fetchPrice(stakingToken, library);
        stakePoolInfo.rewardToken.price = await fetchPrice(rewardToken, library);

        // calculate APR
        if (stakePoolInfo.active) {
          const rewardPerBlock = utils.formatEther(await poolChef.rewardPerBlock());
          const totalAllocPoints = (await poolChef.poolInfo()).allocPoint.toNumber();
          const rewardsPerWeek = new BigNumberJS(rewardPerBlock).times(604800 / 2.1).toNumber();
          const multiplier = 1000; // todo: move to config

          const poolRewardsPerWeek = new BigNumberJS(multiplier)
            .div(totalAllocPoints)
            .times(rewardsPerWeek)
            .toNumber();

          stakePoolInfo.apr = getPoolApr(
            parseFloat(stakePoolInfo.rewardToken.price || "0"),
            poolRewardsPerWeek,
            parseFloat(stakePoolInfo.stakeToken.price || "0"),
            parseFloat(stakePoolInfo.totalStaked || "0")
          );
        } else {
          stakePoolInfo.apr = {
            yearlyAPR: 0,
            weeklyAPR: 0,
            dailyAPR: 0,
          };
        }

        if (account) {
          let stakeTokenContract = getLpContract(stakePoolInfo.stakeToken.address);

          stakePoolInfo.rewardsEarned = utils.formatUnits(
            await poolChef.pendingReward(account),
            stakePoolInfo.rewardToken.decimal
          );

          const userInfo = await poolChef.userInfo(account);

          stakePoolInfo.userTotalStaked = utils.formatUnits(
            userInfo.amount,
            stakePoolInfo.stakeToken.decimal
          );

          stakePoolInfo.hasStaked = !(userInfo.amount as BigNumber).isZero();

          const allowance: BigNumber = await stakeTokenContract.allowance(
            account,
            stakePoolInfo.address
          );

          stakePoolInfo.hasApprovedPool = !allowance.isZero();
        }

        return stakePoolInfo;
      } catch (e) {
        console.error(e);
        return stakePoolInfo;
      }
    },
    [currentBlock, library]
  );

  return fetchData;
}

import { DelegatorInfo, delegatorStakingPools } from "config/delegators";
import { Pool, pools } from "config/delegator-pools";
import { useDelegatorContract, useERC20, useMasterChef } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet"
import { fetchPrice } from "web3-functions/prices";
import { getDelegatorAPR, getPoolApr } from "web3-functions/utils";
import { useToast } from "@chakra-ui/react";
import ReactGA from "react-ga";
import { usePlutusPrice } from "hooks/prices";
import BigNumberJS from "bignumber.js";
import { BigNumber, constants, utils } from "ethers";
import { BLOCKS_PER_SECOND, BLOCK_TIME, SECONDS_PER_WEEK } from 'config/constants';
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";


export const formatTimeLeft = (difference: number) => {
    type time_object = {
        hours: number,
        minutes: number,
        seconds: number
    };
    let timeLeft : time_object = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    const sec_num = parseInt(difference.toString(), 10);
    if (difference > 0) {
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
      timeLeft = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }else{
        timeLeft = {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }
  
    return timeLeft;
  };

function useFetchDelegatorStakingPoolRequest(){
    const getDelegatorStakeContract = useDelegatorContract();
    const currentBlock = useCurrentBlockNumber();
    const { account, library } = useActiveWeb3React();

    return async (delegatorStakeInfo: DelegatorInfo) => {
        try{
            const delegatorContract = getDelegatorStakeContract(delegatorStakeInfo.address);
            
            //Token Price
            // delegatorStakeInfo.rewardToken.price = await fetchPrice(
            //     delegatorStakeInfo.rewardToken,
            //     library
            // );
            
            let balance = await delegatorContract.rewardStatsBalance();
            let reward = await delegatorContract.rewardStatsLastReward();
            let rewardTimeInterval = parseFloat(await delegatorContract.rewardStatsTimeInterval());
            balance = utils.formatUnits(balance);
            reward = utils.formatUnits(reward);

            delegatorStakeInfo.apr = getDelegatorAPR(
                balance,
                reward,
                rewardTimeInterval
            )
            delegatorStakeInfo.canWithdraw = false;

            if(account) {
                //*Balanceof sONE
                const rewardBalanceWei = await delegatorContract.balanceOf(account);
                delegatorStakeInfo.rewardBalance = utils.formatUnits(rewardBalanceWei, 18);
                //*User ONE staked
                const stakedOneWei = await delegatorContract._staked(account);
                delegatorStakeInfo.stakedOne = utils.formatUnits(stakedOneWei, 18);
                delegatorStakeInfo.stakedIn = parseInt(await delegatorContract._stakedIn(account));
                
                
                if (delegatorStakeInfo.stakedIn > 0){
                    const withdrawTimestamp = new Number(await delegatorContract.withdrawTimestamp());
                    const now = parseInt((Date.now()/1000).toString());
                    const ttl = +delegatorStakeInfo.stakedIn + +withdrawTimestamp - now;
                    delegatorStakeInfo.unstakeInfo = ttl > 0 ? formatTimeLeft(ttl) : {hours: 1, minutes: 10, seconds: 30};
                    const canWithdraw = await delegatorContract.canWithdraw(account, utils.parseUnits(delegatorStakeInfo.stakedOne));
                    delegatorStakeInfo.canWithdraw = canWithdraw.allowedToWithdraw;
                    delegatorStakeInfo.reason = canWithdraw.Reason
                }
            }
            
            return delegatorStakeInfo;
        }
        catch (e){
            console.error(e);
            return delegatorStakeInfo;
        }
    }
}

export function useFetchDelegators(){
    const fetchDelegatorPoolRq = useFetchDelegatorStakingPoolRequest();
    const currentBlock = useCurrentBlockNumber();
    const { account } = useActiveWeb3React();

    const delegatorQueries =  useQueries(
        delegatorStakingPools.map((delegator) => {
            return{
                enabled : !!currentBlock,
                queryKey: ["delegator", delegator.address, account],
                queryFn: () => fetchDelegatorPoolRq(delegator),
            };
        })
    );
    return delegatorQueries; 
}

export function useDepositIntoDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const depositMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const overrides = {
                from: account,
                value: utils.parseUnits(amount),
            }
            console.log(overrides);
            console.log(amount)
            const tx = await delegator.deposit(overrides);
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Deposits",
                    action: "Depositing ONE",
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully deposited",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useDepositIntoDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error depositing token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return depositMutation;
}

export function useUnstakeFromDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const unstakeMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const tx = await delegator.unstake(utils.parseUnits(amount, 18));
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Unstake",
                    action: "Unstaking ONE",
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully unstaked",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useUnstakeFromDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error unstaking token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return unstakeMutation;
}

export function useWithdrawFromDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const withdrawMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const overrides = {
                from: account,            }
            const tx = await delegator.withdraw(utils.parseUnits(amount, 18), overrides);
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Withdrawals",
                    action: `Withdrawing ONE`,
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully withdrawed",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useWithdrawFromDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error withdrawing token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return withdrawMutation;
}


function useFetchPoolsRequest() {
  const plutusPrice = usePlutusPrice();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const currentBlock = useCurrentBlockNumber();
  const { account, library } = useActiveWeb3React();

  return async (pool: Pool) => {
    const newPool = pool;

    // Farm data
    let masterChefInfo = await masterChef.poolInfo(pool.pid);

    newPool.multiplier = masterChefInfo.allocPoint.toString();
    
    newPool.depositFees = new BigNumberJS(masterChefInfo.depositFeeBP).div(100).toNumber();

    // newPool.isActive = masterChefInfo.allocPoint.toString() !== "0";

    // Token data
    newPool.stakeToken.address = masterChefInfo.lpToken;
    const lpContract = getLpContract(newPool.stakeToken.address);

    newPool.totalStaked = utils.formatUnits(
      await lpContract.balanceOf(masterChef.address),
      newPool.stakeToken.decimals
    );

    newPool.stakeToken.price = await fetchPrice(newPool.stakeToken, library);
    // console.log(newPool.stakeToken.symbol, newPool.totalStaked, newPool.stakeToken.price, new BigNumberJS(newPool.totalStaked).times(newPool.stakeToken.price).toNumber() );
    // APR data
    const plutusPerBlockWEI = (await masterChef.tokenPerBlock());
    const rewardsPerWeek = plutusPerBlockWEI / 1e18 * SECONDS_PER_WEEK / BLOCK_TIME;
    // console.log({
    //   rewardsPerWeek,
    //   SECONDS_PER_WEEK,
    //   BLOCK_TIME
    // });
    const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

    const poolRewardsPerWeek = new BigNumberJS(newPool.multiplier)
      .div(totalAllocPoints)
      .times(rewardsPerWeek)
      .toNumber();

    newPool.apr = newPool.isActive
      ? getPoolApr(
          parseFloat(plutusPrice.data || "0"),
          poolRewardsPerWeek,
          parseFloat(newPool.stakeToken.price || "0"),
          parseFloat(newPool.totalStaked || "0")
        )
      : {
          yearlyAPR: 0,
          dailyAPR: 0,
          weeklyAPR: 0,
        };

    // USER data
    if (account) {
      newPool.rewardsEarned = utils.formatEther(await masterChef.pendingApollo(pool.pid, account)); // TODO: shouldn be pendingPlutus instead?

      const userInfo = await masterChef.userInfo(pool.pid, account);

      newPool.userTotalStaked = utils.formatUnits(userInfo.amount, newPool.stakeToken.decimals);
      newPool.hasStaked = !(userInfo.amount as BigNumber).isZero();

      const allowance: BigNumber = await lpContract.allowance(account, masterChef.address);
      newPool.hasApprovedPool = !allowance.isZero();
    }

    return newPool;
  };
}

export function useFetchPools() {
  const plutusPrice = usePlutusPrice();
  const fetchPoolRq = useFetchPoolsRequest();
  const { account } = useActiveWeb3React();

  const poolQueries = useQueries(
    pools.map((farm) => {
      return {
        enabled: !!plutusPrice.data,
        queryKey: ["pool", farm.pid, account],
        queryFn: () => fetchPoolRq(farm),
      };
    })
  );

  return poolQueries;
}

export function useApprovePool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", pid, account]);
      const lpContract = getLpContract(pool.stakeToken.address);

      await approveLpContract(lpContract, masterChef.address);
      return pid;
    },

    {
      onSuccess: (pid) => {
        const pool = queryClient.getQueryData<Pool>(["pool", pid, account]);

        queryClient.setQueryData(["pool", pid, account], {
          ...pool,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${pool.stakeToken.symbol}`,
          label: pool.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePool][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return approveMutation;
}

export function useDepositIntoPool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
      await depositIntoPool(
        masterChef,
        id,
        amount,
        constants.AddressZero,
        pool.stakeToken.decimals
      );
    },
    {
      onSuccess: (_, { id, amount }) => {
        const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
        queryClient.invalidateQueries(["pool", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDeposit][error] general error`, { data });

        toast({
          title: "Error depositing token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return depositMutation;
}

export function useWithdrawFromPool() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
      await withdrawFromPool(masterChef, id, amount, pool.stakeToken.decimals);
    },
    {
      onSuccess: (_, { amount, id }) => {
        const pool = queryClient.getQueryData<Pool>(["pool", id, account]);
        queryClient.invalidateQueries(["pool", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${pool.stakeToken.symbol}`,
          value: parseInt(amount, 10),
          label: pool.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdraw][error] general error`, { data });

        toast({
          title: "Error withdrawing token",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return withdrawMutation;
}

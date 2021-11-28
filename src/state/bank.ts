import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { useToast } from "@chakra-ui/toast";
import { utils } from "ethers";
import { usePlutusToken, useBankContract, useERC20 } from "hooks/contracts";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { approveLpContract } from "web3-functions";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { fetchPrice } from "web3-functions/prices";
import { BURN_ADDRESS, SECONDS_PER_YEAR } from "config/constants";
import { generateTimeDuration } from "libs/utils";
import { usePlutusPrice } from "hooks/prices";

dayjs.extend(duration);

const BANK_REWARD_TOKEN = {
  address: "0xD86b5923F3AD7b585eD81B448170ae026c65ae9a",
  symbol: "IRON",
  decimals: 18,
  price: 0,
};

// queries
export const useDepositedAmount = () => {
  const { account } = useActiveWeb3React();
  const bankContract = useBankContract();

  return useQuery({
    queryKey: "bankDepositAmount",
    enabled: !!account,
    queryFn: async () => {
      const resp = await bankContract.userinfo(account);
      return utils.formatUnits(resp.amount, 18);
    },
  });
};

export const useHasApprovedPool = () => {
  const { account } = useActiveWeb3React();
  const bankContract = useBankContract();
  const plutusContract = usePlutusToken();

  return useQuery({
    queryKey: "has-approved-bank",
    enabled: !!account,
    queryFn: async () => {
      const resp = await plutusContract.allowance(account, bankContract.address);
      return !resp.isZero();
    },
  });
};

export const useFetchMainPool = () => {
  const { library } = useActiveWeb3React();
  const bankContract = useBankContract();
  const getErc20 = useERC20();
  const plutusPrice = usePlutusPrice();

  const mainPool = useQuery({
    queryKey: "bank-main-pool",
    enabled: !!plutusPrice.data,
    queryFn: async () => {
      const poolName = "iron";

      const poolInfo = await bankContract.usdcinfo();
      const poolEndTime = (await bankContract.endtime()).toString();

      const timeLeftDiff = dayjs.unix(poolEndTime).diff(dayjs()); // time until pool ends
      const timeLeft = timeLeftDiff > 0 ? generateTimeDuration(timeLeftDiff) : null;

      // display total
      const poolDepositedAmount = utils.formatUnits(await bankContract.totalAmount(), 18);
      const poolTotalPayout = utils.formatUnits(await bankContract.totalpayout(), 18);

      // total rewards
      const rewardTokenPrice = await fetchPrice(BANK_REWARD_TOKEN, library);
      const rewardToken = getErc20(BANK_REWARD_TOKEN.address);

      const totalRewards = utils.formatUnits(
        await rewardToken.balanceOf(bankContract.address),
        BANK_REWARD_TOKEN.decimals
      );

      const totalRewardsInUsd = new BigNumberJS(totalRewards).times(rewardTokenPrice).toString();

      // calculate APR
      /**
       * to calculate the APR we need the pool rewards per week and then convert this to USD and divide it
       * by the total amount in the pool
       */
      let apr = 0;

      if (parseFloat(poolDepositedAmount) > 0 && plutusPrice.data && parseFloat(plutusPrice.data) > 0) {
        const tokenPerSec = utils.formatUnits(poolInfo.usdcPerTime, 18);

        const yearlyRewards = new BigNumberJS(tokenPerSec).times(SECONDS_PER_YEAR);

        const yearlyRewardsUsd = yearlyRewards.times(rewardTokenPrice).dividedBy(`1e${BANK_REWARD_TOKEN.decimals}`);

        const totalStakedInUsd = new BigNumberJS(poolDepositedAmount).times(plutusPrice.data);

        apr = yearlyRewardsUsd.dividedBy(totalStakedInUsd).toNumber() * 100;
        // console.log({
        //   rewardTokenPrice,
        //   tokenPerSec,
        //   yearlyRewards: yearlyRewards.valueOf(),
        //   yearlyRewardsUsd: yearlyRewardsUsd.valueOf(),
        // });
      }

      return {
        poolName,
        timeLeft,
        apr,
        totalRewardsInUsd,
        poolTotalPayout,
      };
    },
  });

  return mainPool;
};

export const useFetchPools = () => {
  const { account, library } = useActiveWeb3React();
  const plutusPrice = usePlutusPrice();
  const bankContract = useBankContract();
  const getLpContract = useERC20();

  const poolLength = useQuery({
    queryKey: "banks-pool-length",
    queryFn: async () => {
      const poolLength = await bankContract.poolLength();
      return poolLength.toString();
    },
  });

  const poolsArr = Array.from({ length: poolLength.data || 0 });

  const pools = useQueries(
    poolsArr.map((_, idx) => {
      return {
        enabled: !!poolLength && !!plutusPrice.data,
        queryKey: ["bank-pool", idx, account],
        queryFn: async ({ queryKey }) => {
          const pid = queryKey[1] as number;
          const poolInfo = await bankContract.poolInfo(pid);

          // pool lp details
          const lpContract = getLpContract(poolInfo.token);

          const symbol = await lpContract.symbol();
          const decimals = await lpContract.decimals();
          if (decimals !== 18) return null;

          // time left
          const poolStartTime = poolInfo.startTime.toString();
          const poolEndTime = poolInfo.endTime.toString();

          const isNew = dayjs.unix(poolStartTime).isBefore(dayjs().add(1, "d")); // if pool is started in less than 2 days

          const timeLeftDiff = dayjs.unix(poolEndTime).diff(dayjs()); // time until pool ends
          if (timeLeftDiff < 1) return null;

          const timeLeft = timeLeftDiff > 0 ? generateTimeDuration(timeLeftDiff) : null;

          // display total
          const poolAmount = poolInfo.initamt.toString();
          const poolDepositedAmount = poolInfo.amount.toString();

          // calculate APR
          const poolTokenPrice = await fetchPrice({ address: lpContract.address, symbol, decimals }, library);

          /**
           * to calculate the APR we need the pool rewards per week and then convert this to USD and divide it
           * by the total amount in the pool
           */
          let apr = 0;

          // todo:: get plutus price

          if (poolDepositedAmount > 0 && plutusPrice.data && parseFloat(plutusPrice.data) > 0) {
            const tokenPerSec = poolInfo.tokenPerSec.toString();
            const yearlyRewards = new BigNumberJS(tokenPerSec).times(SECONDS_PER_YEAR);
            const yearlyRewardsUsd = yearlyRewards.times(poolTokenPrice).dividedBy(`1e${decimals}`);

            const totalStakedInUsd = new BigNumberJS(poolDepositedAmount)
              .times(plutusPrice.data)
              .dividedBy(`1e${decimals}`);

            apr = yearlyRewardsUsd.dividedBy(totalStakedInUsd).toNumber() * 100;
          }

          let enrolled = false;
          if (account) {
            const userinfo = await bankContract.userinfo(account);
            enrolled = userinfo.pids.find((id) => id.toNumber() == pid) !== undefined;
          }

          return {
            pid,
            poolName: symbol,
            isNew,
            apr,
            poolAmount,
            poolAmountInUsd: new BigNumberJS(poolAmount).times(poolTokenPrice).toString(),
            poolStartTime,
            poolEndTime,
            timeLeft,
            enrolled,
          };
        },
      };
    })
  );

  return pools;
};

export const useRewardInfo = () => {
  const pools = useFetchPools();
  const mainPool = useFetchMainPool();

  const isLoading = pools.some((f) => f.status === "loading") || mainPool.status === "loading";

  const aprs = pools
    .reduce((total, curr: any) => {
      return total.plus(curr.data?.apr || 0);
    }, new BigNumberJS(0))
    .plus(mainPool.data?.apr)
    .toString();

  const totalRewards = pools
    .reduce((total, curr: any) => {
      return total.plus(curr.data?.poolAmountInUsd || 0);
    }, new BigNumberJS(0))
    .plus(mainPool.data?.totalRewardsInUsd)
    .toString();

  return { isLoading, aprs, totalRewards };
};

export const useBankStats = () => {
  const plutusContract = usePlutusToken();
  const bankContract = useBankContract();

  const bankStats = useQuery({
    queryKey: "bank-stats",
    queryFn: async () => {
      const totalSupply = utils.formatUnits(await plutusContract.totalSupply(), 18);

      const totalBurntInBank = utils.formatUnits(await bankContract.totalBurnt(), 18);
      const percentageBurntInBank = new BigNumberJS(totalBurntInBank).dividedBy(totalSupply).times(100).toString();

      const totalBurnt = utils.formatUnits(await plutusContract.balanceOf(BURN_ADDRESS), 18);
      const percentageBurnt = new BigNumberJS(totalBurnt).dividedBy(totalSupply).times(100).toString();

      console.log({
        totalSupply: totalSupply.valueOf(),
        totalBurntInBank: totalBurntInBank.valueOf(),
        totalBurnt: totalBurnt.valueOf(),
        percentageBurntInBank: percentageBurntInBank.valueOf(),
        percentageBurnt: percentageBurnt.valueOf(),
      });
      return { totalBurnt, percentageBurnt, totalBurntInBank, percentageBurntInBank };
    },
  });

  return bankStats;
};

export const useMyBankRewards = () => {
  const { account, library } = useActiveWeb3React();
  const plutusPrice = usePlutusPrice();
  const bankContract = useBankContract();
  const getLpContract = useERC20();

  const myBankRewards = useQuery({
    queryKey: ["my-bank-rewards", account],
    enabled: !!account,
    queryFn: async () => {
      const userInfo = await bankContract.userinfo(account);
      const pids = userInfo.pids.map((p) => p.toNumber());

      const poolRewards = [];
      let totalDollarValue = 0;
      for (let pid of pids) {
        const reward = (await bankContract.pendingReward(pid, account)).toString();
        const poolInfo = await bankContract.poolInfo(pid);
        const lpContract = getLpContract(poolInfo.token);
        const symbol = await lpContract.symbol();

        const tokenPrice = await fetchPrice({ address: lpContract.address, symbol: symbol, decimals: 18 }, library);
        const rewardInUsd = new BigNumberJS(reward).times(tokenPrice).toString();

        totalDollarValue = new BigNumberJS(totalDollarValue).plus(rewardInUsd).toNumber();
        poolRewards.push({
          name: symbol,
          reward,
          rewardInUsd,
        });
      }

      const ironRewards = utils.formatUnits(await bankContract.pendingIRON(account), 18);
      const ironPrice = await fetchPrice(BANK_REWARD_TOKEN, library);
      const ironRewardUsd = new BigNumberJS(ironRewards).times(ironPrice).toString();

      // total dollar value
      totalDollarValue = new BigNumberJS(totalDollarValue).plus(ironRewardUsd).toNumber();

      const inPlutus = !!plutusPrice.data
        ? new BigNumberJS(totalDollarValue).dividedBy(plutusPrice.data).toString()
        : 0;

      console.log({ inPlutus });
      return {
        ironRewards,
        poolRewards,
        totalDollarValue,
        inPlutus,
      };
    },
  });

  return myBankRewards;
};

export const useLotteryInfo = () => {
  const { account } = useActiveWeb3React();
  const bankContract = useBankContract();

  const lotteryInfo = useQuery({
    queryKey: ["lottery-info", account],
    enabled: !!account,
    refetchInterval: 1 * 60 * 1000,
    queryFn: async () => {
      const pricePot = utils.formatUnits(await bankContract.lotsize(), 18);
      const mytickets = (await bankContract.mytickets(account))
        .map((tickets) => tickets.toString())
        .filter((tickets) => tickets != "0");

      const totalTickets = (await bankContract.totalticket()).toString();
      const probability = new BigNumberJS(mytickets?.length || 0).dividedBy(totalTickets).times(100).toNumber();

      const lotWinner = await bankContract.lotwinner();
      const winnum = (await bankContract.winnum()).toString();

      const poolEndTime = (await bankContract.endtime()).toString();

      const timeLeftDiff = dayjs.unix(poolEndTime).diff(dayjs()); // time until pool ends
      const timeLeft = timeLeftDiff > 0 ? generateTimeDuration(timeLeftDiff) : null;

      return {
        pricePot,
        mytickets,
        totalTickets,
        probability,
        lotWinner,
        winnum,
        timeLeft,
      };
    },
  });

  return lotteryInfo;
};

// mutations
export const useApproveBank = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();
  const plutusContract = usePlutusToken();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(plutusContract, bankContract.address);
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("has-approved-bank");

        ReactGA.event({
          category: "Approve Bank",
          action: `Approved PLUTUS in Bank`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApproveBank][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token for bank",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return approveMutation;
};

export const useDepositInBank = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();
  const plutusContract = usePlutusToken();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const depositMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");

      const tx = await bankContract.deposit(utils.parseUnits(amount, 18));
      await tx.wait();
    },

    {
      onSuccess: (_, amount) => {
        const poolLength = queryClient.getQueryData("banks-pool-length");
        for (let i = 0; i < poolLength; i++) {
          queryClient.invalidateQueries(["bank-pool", i, account]);
        }

        queryClient.invalidateQueries("bankDepositAmount");
        queryClient.invalidateQueries(["tokenBalance", account, plutusContract.address]);

        ReactGA.event({
          category: "Deposits",
          action: `Deposited PLUTUS in Bank`,
          value: parseInt(amount, 10),
          label: amount,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositInBank][error] general error `, {
          data,
        });

        toast({
          title: "Error depositing",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return depositMutation;
};

export const useEnrollInPool = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const enrollMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");

      const tx = await bankContract.enroll(pid);
      await tx.wait();
    },

    {
      onSuccess: (_, pid) => {
        queryClient.invalidateQueries(["bank-pool", pid, account]);

        ReactGA.event({
          category: "Enroll",
          action: `Enroll in bank pool`,
          label: `PID: ${pid}`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useEnrollInPool][error] general error `, {
          data,
        });

        toast({
          title: "Error enrolling",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return enrollMutation;
};

export const useCompoundInBank = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const compoundMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      const tx = await bankContract.compound();
      await tx.wait();
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["my-bank-rewards", account]);

        ReactGA.event({
          category: "Bank Compound",
          action: `Compound in bank`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useCompoundInBank][error] general error `, {
          data,
        });

        toast({
          title: "Error compouding",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return compoundMutation;
};

export const useHarvestFromBank = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const harvestMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      const tx = await bankContract.deposit(utils.parseUnits("0", 18));
      await tx.wait();
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["my-bank-rewards", account]);

        ReactGA.event({
          category: "Harvest Bank",
          action: `Harvest rewards from Bank`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useHarvestFromBank][error] general error `, {
          data,
        });

        toast({
          title: "Error harvesting",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return harvestMutation;
};

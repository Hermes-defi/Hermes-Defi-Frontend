import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { useToast } from "@chakra-ui/toast";
import { utils } from "ethers";
import { useApolloToken, useBankContract, useERC20 } from "hooks/contracts";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { approveLpContract } from "web3-functions";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { fetchPrice } from "web3-functions/prices";
import { secondsPerYear } from "config/constants";
import { generateTimeDuration } from "libs/utils";
import { useApolloPrice } from "hooks/prices";

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
  const apolloContract = useApolloToken();

  return useQuery({
    queryKey: "has-approved-bank",
    enabled: !!account,
    queryFn: async () => {
      const resp = await apolloContract.allowance(account, bankContract.address);
      return !resp.isZero();
    },
  });
};

export const useFetchMainPool = () => {
  const { library } = useActiveWeb3React();
  const bankContract = useBankContract();
  const apolloPrice = useApolloPrice();

  const mainPool = useQuery({
    queryKey: "bank-main-pool",
    enabled: !!apolloPrice.data,
    queryFn: async () => {
      const poolName = "iron";

      const poolInfo = await bankContract.usdcinfo();
      const poolEndTime = (await bankContract.endtime()).toString();

      const timeLeftDiff = dayjs.unix(poolEndTime).diff(dayjs()); // time until pool ends
      const timeLeft = timeLeftDiff > 0 ? generateTimeDuration(timeLeftDiff) : null;

      // display total
      const poolDepositedAmount = utils.formatUnits(await bankContract.totalAmount(), 18);
      const poolTotalPayout = utils.formatUnits(await bankContract.totalpayout(), 18);

      // calculate APR

      /**
       * to calculate the APR we need the pool rewards per week and then convert this to USD and divide it
       * by the total amount in the pool
       */
      const secondsPerCycle = 259200;
      let apr = 0;
      let cycleRewards = 0;

      if (parseFloat(poolDepositedAmount) > 0 && apolloPrice.data && parseFloat(apolloPrice.data) > 0) {
        const rewardTokenPrice = await fetchPrice(BANK_REWARD_TOKEN, library);

        const tokenPerSec = utils.formatUnits(poolInfo.usdcPerTime, 18);

        const yearlyRewards = new BigNumberJS(tokenPerSec).times(secondsPerYear);
        const cycleRewardsIron = new BigNumberJS(tokenPerSec).times(secondsPerCycle);

        const yearlyRewardsUsd = yearlyRewards.times(rewardTokenPrice).dividedBy(`1e${BANK_REWARD_TOKEN.decimals}`);
        cycleRewards = cycleRewardsIron.times(rewardTokenPrice).dividedBy(`1e${BANK_REWARD_TOKEN.decimals}`).toNumber();

        const totalStakedInUsd = new BigNumberJS(poolDepositedAmount).times(apolloPrice.data);

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
        cycleRewards,
        poolTotalPayout,
      };
    },
  });

  return mainPool;
};

export const useFetchPools = () => {
  const { account, library } = useActiveWeb3React();
  const apolloPrice = useApolloPrice();
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
        enabled: !!poolLength && !!apolloPrice.data,
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

          /**
           * to calculate the APR we need the pool rewards per week and then convert this to USD and divide it
           * by the total amount in the pool
           */
          let apr = 0;

          // todo:: get apollo price

          if (poolDepositedAmount > 0 && apolloPrice.data && parseFloat(apolloPrice.data) > 0) {
            const rewadTokenPrice = await fetchPrice({ address: lpContract.address, symbol, decimals }, library);
            const tokenPerSec = poolInfo.tokenPerSec.toString();
            const yearlyRewards = new BigNumberJS(tokenPerSec).times(secondsPerYear);
            const yearlyRewardsUsd = yearlyRewards.times(rewadTokenPrice).dividedBy(`1e${decimals}`);

            const totalStakedInUsd = new BigNumberJS(poolDepositedAmount)
              .times(apolloPrice.data)
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

export const useBankStats = () => {
  const apolloContract = useApolloToken();
  const bankContract = useBankContract();

  const bankStats = useQuery({
    queryKey: "bank-stats",
    queryFn: async () => {
      const totalSupply = utils.formatUnits(await apolloContract.totalSupply(), 18);
      const totalBurnt = utils.formatUnits(await bankContract.totalBurnt(), 18);
      const percentageBurnt = new BigNumberJS(totalSupply).minus(totalBurnt).dividedBy(totalSupply).toNumber();
      const lotteryWinner = await bankContract.lotwinner();

      return { totalBurnt, percentageBurnt, lotteryWinner };
    },
  });

  return bankStats;
};

export const useMyBankRewards = () => {
  const { account, library } = useActiveWeb3React();
  const apolloPrice = useApolloPrice();
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

      const inApollo = !!apolloPrice.data
        ? new BigNumberJS(totalDollarValue).dividedBy(apolloPrice.data).toString()
        : 0;

      console.log({ inApollo });
      return {
        ironRewards,
        poolRewards,
        totalDollarValue,
        inApollo,
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
    queryFn: async () => {
      const pricePot = utils.formatUnits(await bankContract.lotsize(), 18);
      const mytickets = await bankContract.mytickets(account);
      const totalTickets = (await bankContract.totalticket()).toString();
      const probability = new BigNumberJS(mytickets?.length || 0).dividedBy(totalTickets).times(100).toNumber();

      const lotWinner = await bankContract.lotwinner();
      const winnum = (await bankContract.winnum()).toString();

      return {
        pricePot,
        mytickets,
        totalTickets,
        probability,
        lotWinner,
        winnum,
      };
    },
  });

  return lotteryInfo;
};

// mutations
export const useApproveBank = () => {
  const queryClient = useQueryClient();
  const bankContract = useBankContract();
  const apolloContract = useApolloToken();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(apolloContract, bankContract.address);
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("has-approved-bank");

        ReactGA.event({
          category: "Approve Bank",
          action: `Approved APOLLO in Bank`,
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
  const apolloContract = useApolloToken();

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
        queryClient.invalidateQueries(["tokenBalance", account, apolloContract.address]);

        ReactGA.event({
          category: "Deposits",
          action: `Deposited APOLLO in Bank`,
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

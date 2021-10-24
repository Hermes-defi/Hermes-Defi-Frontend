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
  const { account, library } = useActiveWeb3React();
  const bankContract = useBankContract();
  const apolloPrice = useApolloPrice();

  const mainPool = useQuery({
    queryKey: "bank-main-pool",
    queryFn: async () => {
      const poolName = "iron";

      const poolInfo = await bankContract.usdcinfo();
      const poolEndTime = (await bankContract.endtime()).toString();

      const timeLeftDiff = dayjs.unix(poolEndTime).diff(dayjs()); // time until pool ends
      const timeLeft = timeLeftDiff > 0 ? generateTimeDuration(timeLeftDiff) : null;

      // display total
      const poolDepositedAmount = await bankContract.totalAmount.toString();

      // calculate APR

      /**
       * to calculate the APR we need the pool rewards per week and then convert this to USD and divide it
       * by the total amount in the pool
       */
      let apr = 0;
      let monthlyRewards = 0;

      // todo:: get apollo price

      if (poolDepositedAmount > 0 && apolloPrice.data && parseFloat(apolloPrice.data) > 0) {
        const rewardTokenPrice = await fetchPrice(BANK_REWARD_TOKEN, library);
        const tokenPerSec = poolInfo.usdcPerTime.toString();

        const yearlyRewards = new BigNumberJS(tokenPerSec).times(secondsPerYear);
        const yearlyRewardsUsd = yearlyRewards.times(rewardTokenPrice).dividedBy(`1e${BANK_REWARD_TOKEN.decimals}`);

        monthlyRewards = yearlyRewardsUsd.dividedBy(12).toNumber();

        const totalStakedInUsd = new BigNumberJS(poolDepositedAmount)
          .times(apolloPrice.data)
          .dividedBy(`1e${BANK_REWARD_TOKEN.decimals}`);

        apr = yearlyRewardsUsd.dividedBy(totalStakedInUsd).toNumber() * 100;
      }

      return {
        poolName,
        timeLeft,
        apr,
        monthlyRewards,
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
        enabled: !!poolLength,
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
  const { account, library } = useActiveWeb3React();
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

// mutations
export const useApproveBank = () => {
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

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const depositMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");

      await bankContract.deposit(utils.parseUnits(amount, 18));
    },

    {
      onSuccess: (_, amount) => {
        const poolLength = queryClient.getQueryData("banks-pool-length");
        for (let i = 0; i < poolLength; i++) {
          queryClient.invalidateQueries(["bank-pool", i, account]);
        }

        queryClient.invalidateQueries("bankDepositAmount");

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
          title: "Error approving token for bank",
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
      await bankContract.enroll(pid);
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
          title: "Error enrolling in pool for bank",
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

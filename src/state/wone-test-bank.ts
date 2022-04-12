import defaultTokens from "config/tokens";
import ReactGA from "react-ga";

import { fetchPrice } from "web3-functions/prices";
import { BLOCK_TIME, SECONDS_PER_WEEK } from "config/constants";
import { getPoolApr } from "web3-functions/utils";
import { constants, utils } from "ethers";

import { usePlutusPrice } from "hooks/prices";
import { useERC20, useWoneTestBank } from "hooks/contracts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

export function useFetchGeneralInfo() {
  const { library } = useActiveWeb3React();
  const woneBankContract = useWoneTestBank();
  const plutusPrice = usePlutusPrice();
  const getTokenContract = useERC20();

  const query = useQuery({
    queryKey: ["wone-bank-info"],
    enabled: !!plutusPrice.data,
    refetchInterval: 0.5 * 60 * 1000, // 1 and a half minutes
    queryFn: async () => {
      const result: any = {};

      try {
        const wonePrice = await fetchPrice({ ...defaultTokens.wone, symbol: "WONE" }, library);
        result.wonePrice = wonePrice;

        const totalStaked = utils.formatUnits(await woneBankContract.totalStaked(), defaultTokens.wone.decimals);
        result.totalStaked = totalStaked;

        const plutusPerBlockWEI = await woneBankContract.rewardPerBlock();
        const rewardsPerWeek = ((plutusPerBlockWEI / 1e18) * SECONDS_PER_WEEK) / BLOCK_TIME;

        const apr = getPoolApr(
          parseFloat(plutusPrice.data || "0"),
          rewardsPerWeek,
          parseFloat(wonePrice || "0"),
          parseFloat(totalStaked || "0")
        );

        result.apr = apr;

        result.withdrawLocked = await woneBankContract.withdrawLocked();

        const rewardLpAddress = await woneBankContract.lp();

        if (rewardLpAddress !== constants.AddressZero) {
          const rewardLpContract = getTokenContract(rewardLpAddress);
          result.rewardToken = {
            address: rewardLpAddress,
            symbol: await rewardLpContract.symbol(),
            decimals: await rewardLpContract.decimals(),
          };
        }

        return result;
      } catch (e) {
        console.error("Error fetching wone bank info", e);
        return result;
      }
    },
  });

  return query;
}

export function useUserInfo() {
  const { account } = useActiveWeb3React();
  const woneBankContract = useWoneTestBank();

  return useQuery({
    queryKey: ["wone-bank-user-info", account],
    enabled: !!account,
    refetchInterval: 0.5 * 60 * 1000, // 1 and a half minutes
    queryFn: async () => {
      const pendingReward = utils.formatEther(await woneBankContract.pendingReward(account));
      const stakedShares = utils.formatEther(await woneBankContract.balanceOf(account));

      return {
        pendingReward,
        stakedShares,
      };
    },
  });
}

export const useHasApprovedDepositToken = () => {
  const { account } = useActiveWeb3React();
  const woneBankContract = useWoneTestBank();
  const getTokenContract = useERC20();

  return useQuery({
    queryKey: ["has-approved-wone-bank", account],
    enabled: !!account,
    queryFn: async () => {
      const woneContract = getTokenContract(defaultTokens.wone.address);

      const resp = await woneContract.allowance(account, woneBankContract.address);
      return !resp.isZero();
    },
  });
};

export const useApproveDepositToken = () => {
  const queryClient = useQueryClient();
  const woneBankContract = useWoneTestBank();
  const getTokenContract = useERC20();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      const woneContract = getTokenContract(defaultTokens.wone.address);
      await approveLpContract(woneContract, woneBankContract.address);
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["has-approved-wone-bank", account]);

        ReactGA.event({
          category: "Approve WONE Bank",
          action: `Approved WONE in Bank`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApproveWoneForBank][error] general error `, {
          data,
        });

        toast({
          title: "Error approving WONE for bank",
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

export const useDepositTokenInBank = () => {
  const queryClient = useQueryClient();
  const woneBankContract = useWoneTestBank();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ amount }: { amount: string }) => {
      if (!account) throw new Error("No connected account");

      const tx = await woneBankContract.deposit(utils.parseUnits(amount, 18));
      await tx.wait();
    },

    {
      onSuccess: (_, amount) => {
        queryClient.invalidateQueries(["wone-bank-info"]);
        queryClient.invalidateQueries(["wone-bank-user-info", account]);
        queryClient.invalidateQueries(["tokenBalance", account, defaultTokens.wone.address]);

        ReactGA.event({
          category: "Deposits",
          action: `Deposited WONE in Bank`,
          value: parseInt(amount.amount, 10),
          label: amount.amount,
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

export const useWithdrawLpFromBank = () => {
  const queryClient = useQueryClient();
  const woneBankContract = useWoneTestBank();

  const { account } = useActiveWeb3React();
  const toast = useToast();

  const mutation = useMutation(
    async ({ amount }: { amount: string }) => {
      if (!account) throw new Error("No connected account");

      const tx = await woneBankContract.withdraw(utils.parseUnits(amount, 18));
      await tx.wait();
    },

    {
      onSuccess: (_, { amount }) => {
        const info = queryClient.getQueryData<any>(["wone-bank-info"]);

        queryClient.invalidateQueries(["wone-bank-user-info", account]);
        queryClient.invalidateQueries(["tokenBalance", account, info.rewardToken.address]);
        queryClient.invalidateQueries(["wone-bank-info"]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdraw LP from Bank`,
          value: parseInt(amount, 10),
          label: amount,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdrawLpFromBank][error] general error `, {
          data,
        });

        toast({
          title: "Error withdrawing",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return mutation;
};

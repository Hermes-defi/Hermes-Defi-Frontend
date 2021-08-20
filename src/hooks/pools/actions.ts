import ReactGA from "react-ga";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { usePoolInfo } from "./reducer";
import { approveLpContract, depositIntoPool, withdrawFromPool } from "web3-functions";
import { constants } from "ethers";
import { useERC20, useMasterChef } from "../contracts";
import { getReferralAddress } from "../referral";
import { useFetchPoolData } from "./queries";
import { useIrisPrice } from "hooks/prices";
import { balancersDefaultData, farmsDefaultData, poolDefaultData } from "config/pools";

export function useApprovePool() {
  const { account } = useActiveWeb3React();
  const [state, dispatch] = usePoolInfo();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");
      const pool = state.find((p) => p.pid === pid);
      const lpContract = getLpContract(pool.lpAddress);

      await approveLpContract(lpContract);
      return pid;
    },

    {
      onSuccess: (pid) => {
        dispatch({ type: "APPROVE_CONTRACT", payload: { approved: true, pid } });

        const token = state.find((p) => p.pid === pid)?.lpToken;
        ReactGA.event({
          category: "Approval",
          action: `Approving ${token}`,
          label: token,
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
  const referrer = getReferralAddress();
  const { account } = useActiveWeb3React();
  const [pools, dispatch] = usePoolInfo();

  const { data: irisPrice } = useIrisPrice();
  const getPoolData = useFetchPoolData(irisPrice);
  const masterChef = useMasterChef();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = pools.find((p) => p.pid === pid);
      await depositIntoPool(
        masterChef,
        pid,
        amount,
        referrer || constants.AddressZero,
        pool.decimals
      );

      // fetch new pool data
      const poolInfo = [...poolDefaultData, ...farmsDefaultData, ...balancersDefaultData].find(
        (p) => p.pid === pid
      );

      const data = await getPoolData(poolInfo);
      return { data };
    },
    {
      onSuccess: ({ data }, { pid, amount }) => {
        dispatch({ type: "UPDATE_POOL", payload: { pid, data } });

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${data.lpToken}`,
          value: parseInt(amount, 10),
          label: data.lpToken,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositIntoPool][error] general error`, {
          data,
        });

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

export function useWithdraw() {
  const { account } = useActiveWeb3React();
  const [pools, dispatch] = usePoolInfo();
  const { data: irisPrice } = useIrisPrice();
  const getPoolData = useFetchPoolData(irisPrice);
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const pool = pools.find((p) => p.pid === pid);
      await withdrawFromPool(masterChef, pid, amount, pool.decimals);

      // fetch new pool data
      const poolInfo = [...poolDefaultData, ...farmsDefaultData, ...balancersDefaultData].find(
        (p) => p.pid === pid
      );
      const data = await getPoolData(poolInfo);
      return { data };
    },
    {
      onSuccess: ({ data }, { amount, pid }) => {
        dispatch({ type: "UPDATE_POOL", payload: { pid, data } });

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${data.lpToken}`,
          value: parseInt(amount, 10),
          label: data.lpToken,
        });
      },

      onError: ({ data }) => {
        console.error(`[useWithdraw][error] general error`, {
          data,
        });

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

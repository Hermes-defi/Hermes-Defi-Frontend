import { useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { usePoolInfo } from "./pools-reducer";
import { approveLpContract, depositIntoPool, getPoolData, withdrawFromPool } from "web3-functions";
import { constants } from "ethers";
import { useERC20, useMasterChef } from "./contracts";
import { getReferralAddress } from "./referral";

export function useApprovePool() {
  const { account } = useActiveWeb3React();
  const [state, dispatch] = usePoolInfo();
  const getLpContract = useERC20();
  const toast = useToast();

  const approveMutation = useMutation(
    async (pid: number) => {
      if (!account) throw new Error("No connected account");
      const pool = state[pid];
      const lpContract = getLpContract(pool.lpAddress);

      await approveLpContract(lpContract);
      return pid;
    },

    {
      onSuccess: (pid) => {
        dispatch({ type: "APPROVE_CONTRACT", payload: { approved: true, pid } });
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
  const toast = useToast();

  const getLpContract = useERC20();
  const masterChef = useMasterChef();

  const { account } = useActiveWeb3React();
  const [_, dispatch] = usePoolInfo();

  const referrer = getReferralAddress();

  const depositMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");
      await depositIntoPool(masterChef, pid, amount, referrer || constants.AddressZero);

      // fetch new pool data
      const data = await getPoolData(pid, account, masterChef, getLpContract);
      return { data, pid };
    },
    {
      onSuccess: ({ data, pid }) => {
        dispatch({ type: "UPDATE_POOL", payload: { pid, data } });
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
  const [_, dispatch] = usePoolInfo();
  const getLpContract = useERC20();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ pid, amount }: { pid: number; amount: string }) => {
      if (!account) throw new Error("No connected account");
      await withdrawFromPool(masterChef, pid, amount);

      // fetch new pool data
      const data = await getPoolData(pid, account, masterChef, getLpContract);
      return { data, pid };
    },
    {
      onSuccess: ({ data, pid }) => {
        dispatch({ type: "UPDATE_POOL", payload: { pid, data } });
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

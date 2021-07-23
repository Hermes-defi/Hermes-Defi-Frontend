import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useActiveWeb3React } from "wallet";
import { usePoolInfo } from "./pools-reducer";
import { defaultContracts, useGetContract } from "./wallet";
import Erc20ABI from "abis/ERC20.json";
import { approveLpContract, depositIntoPool, getPool, withdrawFromPool } from "web3-functions";
import { constants } from "ethers";

export function useApprovePool() {
  const { state, dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();

  const [requestingApproval, setRequestingApproval] = useState(false);
  const getContract = useGetContract();

  const toast = useToast();

  const approve = useCallback(
    async (pid: number) => {
      try {
        if (requestingApproval) return;
        if (!account) throw new Error("No connected account");
        setRequestingApproval(true);

        const pool = state[pid];
        const lpContract = getContract({ address: pool.lpAddress, abi: Erc20ABI });

        await approveLpContract(lpContract);
        dispatch({ type: "APPROVE_CONTRACT", payload: { approved: true, pid } });
      } catch (err) {
        console.error(`[useApprovePool][error] general error - ${err.message}`, {
          err,
        });

        toast({
          title: "Error approving token",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });

        return false;
      } finally {
        setRequestingApproval(false);
      }
    },
    [account]
  );

  return { requestingApproval, approve };
}

export function useDepositIntoPool() {
  const toast = useToast();

  const { dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();

  const [depositing, setDepositing] = useState(false);
  const getContract = useGetContract();

  const deposit = useCallback(
    async (pid: number, amount: string) => {
      try {
        if (depositing) return;
        if (!account) throw new Error("No connected account");

        setDepositing(true);

        const masterChefContract = getContract(defaultContracts.masterChef);
        await depositIntoPool(masterChefContract, pid, amount, constants.AddressZero);

        // fetch new pool data
        const newPoolInfo = await getPool(pid, { getContract, account });
        dispatch({ type: "UPDATE_POOL", payload: { pid, data: newPoolInfo } });
      } catch (err) {
        console.error(`[useDepositIntoPool][error] general error - ${err.message}`, {
          err,
        });

        toast({
          title: "Error depositing into pool",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });

        return false;
      } finally {
        setDepositing(false);
      }
    },
    [account]
  );

  return { deposit, depositing };
}

export function useHarvestRewards() {
  const toast = useToast();

  const { dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();

  const [harvesting, setHarvesting] = useState(false);
  const getContract = useGetContract();

  const harvest = useCallback(
    async (pid: number) => {
      try {
        if (harvesting) return;
        if (!account) throw new Error("No connected account");

        setHarvesting(true);

        const masterChefContract = getContract(defaultContracts.masterChef);

        // deposit 0 into the pool since we only want to collect the rewards
        await depositIntoPool(masterChefContract, pid, "0", constants.AddressZero);

        // fetch new pool data
        const newPoolInfo = await getPool(pid, { getContract, account });
        dispatch({ type: "UPDATE_POOL", payload: { pid, data: newPoolInfo } });
      } catch (err) {
        console.error(`[useHarvestRewards][error] general error - ${err.message}`, {
          err,
        });

        toast({
          title: "Error harvesting rewards",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });

        return false;
      } finally {
        setHarvesting(false);
      }
    },
    [account]
  );

  return { harvest, harvesting };
}

export function useWithdraw() {
  const toast = useToast();

  const { dispatch } = usePoolInfo();
  const { account } = useActiveWeb3React();

  const [withdrawing, setWithdrawing] = useState(false);
  const getContract = useGetContract();

  const withdraw = useCallback(
    async (pid: number, amount: string) => {
      try {
        if (withdrawing) return;
        if (!account) throw new Error("No connected account");

        setWithdrawing(true);

        const masterChefContract = getContract(defaultContracts.masterChef);

        // deposit 0 into the pool since we only want to collect the rewards
        await withdrawFromPool(masterChefContract, pid, amount);

        // fetch new pool data
        const newPoolInfo = await getPool(pid, { getContract, account });
        dispatch({ type: "UPDATE_POOL", payload: { pid, data: newPoolInfo } });
      } catch (err) {
        console.error(`[useWithdraw][error] general error - ${err.message}`, {
          err,
        });

        toast({
          title: "Error withdrawing token",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });

        return false;
      } finally {
        setWithdrawing(false);
      }
    },
    [account]
  );

  return { withdraw, withdrawing };
}

import ReactGA from "react-ga";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useERC20, useSwapUSDCContract } from "./contracts";
import { utils } from "ethers";
import tokens from "config/tokens";
import { approveLpContract } from "web3-functions";

export function useUsdcApproved() {
  const { account } = useActiveWeb3React();
  const getLpContract = useERC20();
  const swapContract = useSwapUSDCContract();

  return useQuery({
    queryKey: ["swap-usdc-allowance", account],
    queryFn: async () => {
      const lpContract = getLpContract(tokens.usdc.address);
      if (!account) return false;

      const allowance = await lpContract.allowance(account, swapContract.address);
      return !allowance.isZero();
    },
  });
}

export function useApproveSwapUsdc() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getLpContract = useERC20();
  const swapContract = useSwapUSDCContract();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");

      const lpContract = getLpContract(tokens.usdc.address);
      await approveLpContract(lpContract, swapContract.address);
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["swap-usdc-allowance", account]);
        await queryClient.invalidateQueries(["tokenBalance", account, tokens.usdc.address]);

        ReactGA.event({
          category: "swap USDC Approval",
          action: `Approved USDC`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApproveSwapUsdc][error] general error `, {
          data,
        });

        toast({
          title: "Error apprsoving token for swap",
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

export function useSwapUSDCForApollo() {
  const { account } = useActiveWeb3React();
  const swapContract = useSwapUSDCContract();
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");
      const tx = await swapContract.buy(utils.parseUnits(amount, 6));
      await tx.wait();
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("apolloInWallet");

        ReactGA.event({
          category: "Swap USDC for APOLLO",
          action: `Swapped USDC for APOLLO`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapUSDCForApollo][error] general error `, {
          data,
        });

        toast({
          title: "Error purchasing APOLLO",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return mutation;
}

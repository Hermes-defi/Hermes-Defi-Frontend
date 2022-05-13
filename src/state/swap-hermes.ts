import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useERC20_v2, useHermesToken, usepHermesToken, usePlutusToken, usepPlutus, usePresaleContract, useRedeemHermes, useSwapHermes, useSwapHermesBank } from "hooks/contracts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

//*DONE
export function usePresaleInfo() {
  const presaleContract = useSwapHermes();
  const presaleBankContract = useSwapHermesBank();
  const pHermesToken = usepHermesToken();
  const pltsContract = usePlutusToken();
  const { account } = useActiveWeb3React();
  
  return useQuery({
    queryKey: ["hermes-presale-info"],
    queryFn: async () => {
      const data: any = {};

      /*
      * Info from swap general contract:
      *   startBlock, endBlock,
      *   maxpHermes, pHermesRemaining
      */
      data.generalStartBlock = (await presaleContract.startBlock()).toString();
      data.generalEndBlock = (await presaleContract.endBlock()).toString();
      data.generalMaxpHermes = utils.formatEther(await presaleContract.preHermesMaximumAvailable());
      data.generalPHermesRemaining = utils.formatEther(await pHermesToken.balanceOf(presaleContract.address));

      /*
      * Info from swap bank contract:
      *   startBlock, endBlock,
      *   maxpHermes, pHermesRemaining
      */
      data.bankStartBlock = (await presaleBankContract.startBlock()).toString();
      data.bankEndBlock = (await presaleBankContract.endBlock()).toString();
      data.bankMaxpHermes = utils.formatEther(await presaleBankContract.preHermesMaximumAvailable());
      data.bankPHermesRemaining = utils.formatEther(await pHermesToken.balanceOf(presaleBankContract.address));

      /*
      * User info: 
      *   pHermesBalance
      */
      if (account) {
        data.generalPltsApproved = !(
          await pltsContract.allowance(account, presaleContract.address)
        ).isZero();
        data.bankPltsApproved = !(
          await pltsContract.allowance(account, presaleBankContract.address)
        ).isZero();
        data.pHermesBalance = utils.formatEther(await pHermesToken.balanceOf(account));
      }

      return data;
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function usePresaleQuote(amount) {
  const presaleContract = usePresaleContract();
  const { account } = useActiveWeb3React();
  // const realAmount = Number(amount) / 0.116;

  return useQuery({
    queryKey: ["hermes-presale-quote", account, amount],
    queryFn: async () => {
      const resp = await presaleContract.quoteAmounts(utils.parseEther(amount), account);

      console.debug(resp);
      const amountInDAI = utils.formatUnits(resp.inDAI.toString(), 18);

      return {
        amountInDAI,
      };
    },
    enabled: !!account && !!amount.length,
    refetchInterval: 0.5 * 60 * 1000,
  });
}
//*DONE
export function useSwapInfo() {
  const presaleContract = useRedeemHermes();
  const pHermesContract = usepHermesToken();
  const hermesContract = useHermesToken();
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["hermes-swap-info"],
    queryFn: async () => {
      const swapStarts = await presaleContract.startBlock();

      const pHermesRemaining = utils.formatEther(await pHermesContract.balanceOf(presaleContract.address));
      const hermesRemaining = utils.formatEther(await hermesContract.balanceOf(presaleContract.address));

      let pHermesBalance;
      let pHermesApproved = false;

      if (account) {
        pHermesBalance = utils.formatEther(await pHermesContract.balanceOf(account));
        pHermesApproved = !(await pHermesContract.allowance(account, presaleContract.address)).isZero();
      }

      return {
        swapStarts,
        pHermesRemaining,
        hermesRemaining,
        pHermesBalance,
        pHermesApproved,
      };
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

//*DONE
export function usePresaleApproveToken() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const pHermesContract = usepHermesToken();
  const presaleContract = useSwapHermes();
  const pltsContract = usePlutusToken();
  const toast = useToast();

  const approveMutation = useMutation(
    async (token: "plts") => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(
        pltsContract,
        pHermesContract.address
      );

      return token;
    },

    {
      onSuccess: (token:"plts") => {
        const data: any = queryClient.getQueryData(["hermes-presale-info"]);

        queryClient.setQueryData(["hermes-presale-info"], {
          ...data,
          ...(token === "plts" ? { generalPltsApproved: true, bankPltsApproved: true } : {}),
        });

        ReactGA.event({
          category: "pHRMS Pool Approval",
          action: `Approving ${token}`,
          label: token,
        });
      },

      onError: ({ data }) => {
        console.error(`[usePresaleApproveToken][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token for pre-sale",
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

export function useApprovePHermes() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const pHermesContract = usepHermesToken();
  const presaleContract = useRedeemHermes();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      await approveLpContract(pHermesContract, presaleContract.address);
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["hermes-swap-info"]);

        ReactGA.event({
          category: "swap pHermes Approval",
          action: `Approving pHermes`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePHermes][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token for swap",
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

export function useSwapPlutus() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = useSwapHermes();
  const toast = useToast();
  

  const swapMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");
      // const realAmount = Number(amount) / 0.116;
      const tx = await presaleContract.swapPltsForPresaleTokensL3(utils.parseUnits(amount, 18));
      await tx.wait();

      return amount;
    },
    {
      onSuccess: (amount) => {
        queryClient.invalidateQueries(["hermes-presale-info"]);

        ReactGA.event({
          category: "PLTS to pHRMS swap",
          action: `Swap PLTS`,
          value: parseInt(amount, 10),
          label: "SwapPLTS",
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapPlutus][error] general error`, { data });

        toast({
          title: "Error purchasing pHermes",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return swapMutation;
}

export function useSwapBankPlutus() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = useSwapHermesBank();
  const toast = useToast();
  

  const swapMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");
      // const realAmount = Number(amount) / 0.116;
      const tx = await presaleContract.swapPltsForPresaleTokensL3(utils.parseUnits(amount, 18));
      await tx.wait();

      return amount;
    },
    {
      onSuccess: (amount) => {
        queryClient.invalidateQueries(["hermes-presale-info"]);

        ReactGA.event({
          category: "PLTS to pHRMS swap BANK",
          action: `Swap PLTS BANK`,
          value: parseInt(amount, 10),
          label: "SwapPLTSBANK",
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapBankPlutus][error] general error`, { data });

        toast({
          title: "Error purchasing pHermes",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return swapMutation;
}


export function useSwapPHermes() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = useRedeemHermes();
  const toast = useToast();

  const mutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");
      const tx = await presaleContract.swapPreHermesForHermes(utils.parseUnits(amount, 18));
      await tx.wait();
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["hermes-swap-info"]);

        ReactGA.event({
          category: "Swap pHRMS",
          action: `Swapped pHRMS for HRMS`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapPHermes][error] general error `, {
          data,
        });

        toast({
          title: "Error swapping pHRMS",
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

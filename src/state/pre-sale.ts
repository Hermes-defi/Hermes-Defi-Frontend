import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useERC20_v2, usePlutusToken, usepPlutus, usePresaleContract } from "hooks/contracts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

export function usePresaleInfo() {
  const presaleContract = usePresaleContract();
  const pPlutusContract = usepPlutus();
  const daiContract = useERC20_v2(token.dai.address);
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["plutus-presale-info"],
    queryFn: async () => {
      const data: any = {};

      /*
      * Info from presale contract:
      *   startBlock, endBlock, ratio
      *   maxpPlutus, pPlutusPrice, pPlutusRemaining
      */
      data.startBlock = (await presaleContract.startBlock()).toString();
      data.endBlock = (await presaleContract.endBlock()).toString();
      // data.ratio = (await presaleContract.ratio()).toString();

      data.maxpPlutus = utils.formatEther(await presaleContract.maxTokenPurchase());
      data.pPlutusPrice = (await presaleContract.pPLUTUSPrice()).toString();
      data.pPlutusRemaining = utils.formatEther(await pPlutusContract.balanceOf(presaleContract.address));

      if (account) {
        data.daiApproved = !(
          await daiContract.allowance(account, presaleContract.address)
        ).isZero();
        data.pPlutusBalance = utils.formatEther(await pPlutusContract.balanceOf(account));
      }

      return data;
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function usePresaleQuote(amount) {
  const presaleContract = usePresaleContract();
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["plutus-presale-quote", account, amount],
    queryFn: async () => {
      const resp = await presaleContract.quoteAmounts(utils.parseEther(amount), account);

      console.log(resp);
      const amountInDAI = utils.formatUnits(resp.inDai.toString(), 6);

      return {
        amountInDAI,
      };
    },
    enabled: !!account && !!amount.length,
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function useSwapInfo() {
  const presaleContract = usePresaleContract();
  const pPlutusContract = usepPlutus();
  const plutusContract = usePlutusToken();
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["plutus-swap-info"],
    queryFn: async () => {
      const swapStarts = "20711511"; //TODO: change swapStarts

      const pPlutusRemaining = utils.formatEther(await pPlutusContract.balanceOf(presaleContract.address));
      const plutusRemaining = utils.formatEther(await plutusContract.balanceOf(presaleContract.address));

      let pPlutusBalance;
      let pPlutusApproved = false;

      if (account) {
        pPlutusBalance = utils.formatEther(await pPlutusContract.balanceOf(account));
        pPlutusApproved = !(await pPlutusContract.allowance(account, presaleContract.address)).isZero();
      }

      return {
        swapStarts,
        pPlutusRemaining,
        plutusRemaining,
        pPlutusBalance,
        pPlutusApproved,
      };
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}


export function usePresaleApproveToken() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract();
  const daiContract = useERC20_v2(token.dai.address);
  const toast = useToast();

  const approveMutation = useMutation(
    async (token: "dai") => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(
        daiContract,
        presaleContract.address
      );

      return token;
    },

    {
      onSuccess: (token:"dai") => {
        const data: any = queryClient.getQueryData(["plutus-presale-info"]);

        queryClient.setQueryData(["plutus-presale-info"], {
          ...data,
          ...(token === "dai" ? { daiApproved: true } : {}),
        });

        ReactGA.event({
          category: "pPlutus Pool Approval",
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

export function useApprovePPlutus() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const pPlutusContract = usepPlutus();
  const presaleContract = usePresaleContract();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      await approveLpContract(pPlutusContract, presaleContract.address);
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["plutus-swap-info"]);

        ReactGA.event({
          category: "swap pPLUTUS Approval",
          action: `Approving pPlutus`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePPlutus][error] general error `, {
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

export function useBuyPPlutus() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract();
  const toast = useToast();

  const purchaseMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");

      const tx = await presaleContract.buy(utils.parseUnits(amount, 18));
      await tx.wait();

      return amount;
    },
    {
      onSuccess: (amount) => {
        queryClient.invalidateQueries(["plutus-presale-info"]);

        ReactGA.event({
          category: "pPLUTUS Purchase",
          action: `Purchase pPLUTUS`,
          value: parseInt(amount, 10),
          label: "pPlutus",
        });
      },

      onError: ({ data }) => {
        console.error(`[useBuyPPlutus][error] general error`, { data });

        toast({
          title: "Error purchasing pPLUTUS",
          description: data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return purchaseMutation;
}

export function useSwapPPlutus() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract();
  const toast = useToast();

  const mutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      const tx = await presaleContract.swapAll();
      await tx.wait();
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["plutus-swap-info"]);

        ReactGA.event({
          category: "Swap pPLUTUS",
          action: `Swapped pPLUTUS for PLUTUS`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapPPlutus][error] general error `, {
          data,
        });

        toast({
          title: "Error swapping pPLUTUS",
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

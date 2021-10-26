import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useApolloToken, useERC20_v2, usePApollo, usePresaleContract } from "hooks/contracts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

export function usePresaleInfo(version: "v1" | "v2") {
  const presaleContract = usePresaleContract(version);
  const pApolloContract = usePApollo();
  const usdcContract = useERC20_v2(token.usdc.address);
  const irisContract = useERC20_v2(token.iris.address);
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["apollo-presale-info"],
    queryFn: async () => {
      const data: any = {};

      data.startBlock = (await presaleContract.startBlock()).toString();
      data.endBlock = (await presaleContract.endBlock()).toString();
      data.ratio = (await presaleContract.ratio()).toString();

      data.maxpApollo = utils.formatEther(await presaleContract.maxTokenPurchase());
      data.maxpApolloWhitelist = utils.formatEther(await presaleContract.maxTokenPurchaseHeroes());
      data.pApolloPrice = (await presaleContract.pAPOLLOPrice()).toString();
      data.pApolloRemaining = utils.formatEther(await pApolloContract.balanceOf(presaleContract.address));

      if (account) {
        data.irisApproved = !(await irisContract.allowance(account, presaleContract.address)).isZero();

        data.usdcApproved = !(await usdcContract.allowance(account, presaleContract.address)).isZero();

        data.pApolloBalance = utils.formatEther(await pApolloContract.balanceOf(account));
      }

      return data;
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function usePresaleQuote(version: "v1" | "v2", amount) {
  const presaleContract = usePresaleContract(version);
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["apollo-presale-quote", account, amount],
    queryFn: async () => {
      const resp = await presaleContract.quoteAmounts(utils.parseEther(amount), account);

      console.log(resp);
      const amountInIRIS = utils.formatEther(resp.amountIRIS.toString());
      const amountInUSDC = utils.formatUnits(resp.inUsdc.toString(), 6);

      return {
        amountInIRIS,
        amountInUSDC,
      };
    },
    enabled: !!account && !!amount.length,
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function useSwapInfo() {
  const presaleV1Contract = usePresaleContract("v1");
  const presaleV2Contract = usePresaleContract("v2");
  const pApolloContract = usePApollo();
  const apolloContract = useApolloToken();
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["apollo-swap-info"],
    queryFn: async () => {
      const swapStarts = "20711511";

      const pApolloRemainingV1 = utils.formatEther(await pApolloContract.balanceOf(presaleV1Contract.address));
      const pApolloRemainingV2 = utils.formatEther(await pApolloContract.balanceOf(presaleV2Contract.address));
      const apolloRemainingV1 = utils.formatEther(await apolloContract.balanceOf(presaleV1Contract.address));
      const apolloRemainingV2 = utils.formatEther(await apolloContract.balanceOf(presaleV2Contract.address));

      let pApolloBalance;
      let pAPOLLOv1Approved = false;
      let pAPOLLOv2Approved = false;
      if (account) {
        pApolloBalance = utils.formatEther(await pApolloContract.balanceOf(account));
        pAPOLLOv1Approved = !(await pApolloContract.allowance(account, presaleV1Contract.address)).isZero();
        pAPOLLOv2Approved = !(await pApolloContract.allowance(account, presaleV2Contract.address)).isZero();
      }

      return {
        swapStarts,
        pApolloRemainingV1,
        pApolloRemainingV2,
        apolloRemainingV1,
        apolloRemainingV2,
        pApolloBalance,
        pAPOLLOv1Approved,
        pAPOLLOv2Approved,
      };
    },
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function usePresaleApproveToken(version: "v1" | "v2") {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract(version);
  const irisContract = useERC20_v2(token.iris.address);
  const usdcContract = useERC20_v2(token.usdc.address);
  const toast = useToast();

  const approveMutation = useMutation(
    async (token: "iris" | "usdc") => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(token === "iris" ? irisContract : usdcContract, presaleContract.address);

      return token;
    },

    {
      onSuccess: (token: "iris" | "usdc") => {
        const data: any = queryClient.getQueryData(["apollo-presale-info"]);

        queryClient.setQueryData(["apollo-presale-info"], {
          ...data,
          ...(token === "iris" ? { irisApproved: true } : {}),
          ...(token === "usdc" ? { usdcApproved: true } : {}),
        });

        ReactGA.event({
          category: "pAPOLLO Pool Approval",
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

export function useApprovePApollo(version: "v1" | "v2") {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const pApolloContract = usePApollo();
  const presaleContract = usePresaleContract(version);
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      await approveLpContract(pApolloContract, presaleContract.address);
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["apollo-swap-info"]);

        ReactGA.event({
          category: "swap pAPOLLO Approval",
          action: `Approving pAPOLLO`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePApollo][error] general error `, {
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

export function useBuyPApollo(version: "v1" | "v2") {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract(version);
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
        queryClient.invalidateQueries(["apollo-presale-info"]);

        ReactGA.event({
          category: "pAPOLLO Purchase",
          action: `Purchase pAPOLLO`,
          value: parseInt(amount, 10),
          label: "pAPOLLO",
        });
      },

      onError: ({ data }) => {
        console.error(`[useBuyPApollo][error] general error`, { data });

        toast({
          title: "Error purchasing pAPOLLO",
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

export function useSwapPApollo(version: "v1" | "v2") {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract(version);
  const toast = useToast();

  const mutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      const tx = await presaleContract.swapAll();
      await tx.wait();
    },

    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["apollo-swap-info"]);

        ReactGA.event({
          category: "Swap pAPOLLO",
          action: `Swapped pAPOLLO for APOLLO`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useSwapPApollo][error] general error `, {
          data,
        });

        toast({
          title: "Error swapping pAPOLLO",
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

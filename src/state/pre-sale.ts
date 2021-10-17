import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useERC20_v2, usePApollo, usePresaleContract } from "hooks/contracts";
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

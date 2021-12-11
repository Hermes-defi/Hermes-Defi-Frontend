import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useERC20_v2, usePlutusToken, usePresaleContract } from "hooks/contracts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

export function usePresaleInfo() {
  const presaleContract = usePresaleContract();
  const plutusContract = usePlutusToken();
  const daiContract = useERC20_v2(token.dai.address);
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["plutus-presale-info"],
    queryFn: async () => {
      const data: any = {};

      data.startBlock = (await presaleContract.startBlock()).toString();
      data.endBlock = (await presaleContract.endBlock()).toString();
      data.ratio = (await presaleContract.ratio()).toString();

      if (account) {
        data.plutusApproved = !(
          await plutusContract.allowance(account, presaleContract.address)
        ).isZero();

        data.daiApproved = !(
          await daiContract.allowance(account, presaleContract.address)
        ).isZero();
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
      const amountInPLUTUS = utils.formatEther(resp.amountPLUTUS.toString());
      const amountInDAI = utils.formatUnits(resp.inDai.toString(), 6);

      return {
        amountInPLUTUS,
        amountInDAI,
      };
    },
    enabled: !!account && !!amount.length,
    refetchInterval: 0.5 * 60 * 1000,
  });
}

export function usePresaleApproveToken() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const presaleContract = usePresaleContract();
  const plutusContract = usePlutusToken();
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
          category: "Pool Approval",
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

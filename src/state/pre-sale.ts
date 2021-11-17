import ReactGA from "react-ga";
import token from "config/tokens";
import { utils } from "ethers";
import { useERC20_v2, usePlutusToken, usePresaleContract } from "hooks/contracts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useActiveWeb3React } from "wallet";
import { useToast } from "@chakra-ui/react";
import { approveLpContract } from "web3-functions";

export function usePresaleInfo(version: "v1" | "v2") {
  const presaleContract = usePresaleContract(version);
  const plutusContract = usePlutusToken();
  const usdcContract = useERC20_v2(token.usdc.address);
  const { account } = useActiveWeb3React();

  return useQuery({
    queryKey: ["apollo-presale-info"],
    queryFn: async () => {
      const data: any = {};

      data.startBlock = (await presaleContract.startBlock()).toString();
      data.endBlock = (await presaleContract.endBlock()).toString();
      data.ratio = (await presaleContract.ratio()).toString();

      if (account) {
        data.plutusApproved = !(
          await plutusContract.allowance(account, presaleContract.address)
        ).isZero();

        data.usdcApproved = !(
          await usdcContract.allowance(account, presaleContract.address)
        ).isZero();
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
      const amountInPLUTUS = utils.formatEther(resp.amountPLUTUS.toString());
      const amountInUSDC = utils.formatUnits(resp.inUsdc.toString(), 6);

      return {
        amountInPLUTUS,
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
  const plutusContract = usePlutusToken();
  const usdcContract = useERC20_v2(token.usdc.address);
  const toast = useToast();

  const approveMutation = useMutation(
    async (token: "plutus" | "usdc") => {
      if (!account) throw new Error("No connected account");

      await approveLpContract(
        token === "plutus" ? plutusContract : usdcContract,
        presaleContract.address
      );

      return token;
    },

    {
      onSuccess: (token: "plutus" | "usdc") => {
        const data: any = queryClient.getQueryData(["apollo-presale-info"]);

        queryClient.setQueryData(["apollo-presale-info"], {
          ...data,
          ...(token === "plutus" ? { plutusApproved: true } : {}),
          ...(token === "usdc" ? { usdcApproved: true } : {}),
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

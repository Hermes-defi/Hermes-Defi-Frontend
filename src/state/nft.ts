import BigNumberJS from "bignumber.js";
import ReactGA from "react-ga";
import { useToast } from "@chakra-ui/react";
import { useHermesNftContract, useIrisToken } from "hooks/contracts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet";
import { approveLpContract } from "web3-functions";

export function useNFTInfo() {
  const nftContract = useHermesNftContract();
  const irisContract = useIrisToken();
  const { account } = useActiveWeb3React();

  const nftQuery = useQuery({
    refetchInterval: 0.5 * 60 * 1000,
    queryKey: ["hermes-heroes", account],
    queryFn: async () => {
      const totalSupply = (await nftContract.nftsNumber()).toString();
      const totalMinted = (await nftContract.minted()).toString();
      const totalAvailable = new BigNumberJS(totalSupply).minus(totalMinted);
      const percentageAvailable = (1 - totalAvailable.dividedBy(totalSupply).toNumber()) * 100;

      let hasUserApproved = false;
      if (account) {
        const allowance = await irisContract.allowance(account, nftContract.address);
        hasUserApproved = !allowance.isZero();
      }

      return {
        totalSupply,
        totalMinted,
        totalAvailable: totalAvailable.toString(),
        percentageAvailable,
        hasUserApproved,
      };
    },
  });

  return nftQuery;
}

export function useApproveNft() {
  const { account } = useActiveWeb3React();
  const nftContract = useHermesNftContract();
  const irisContract = useIrisToken();
  const toast = useToast();

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      await approveLpContract(irisContract, nftContract.address);
    },

    {
      onSuccess: () => {
        ReactGA.event({
          category: "Approval",
          action: `Approving NFT contract`,
          label: account,
        });
      },

      onError: (err: any) => {
        console.error(`[useApproveNft][error] general error `, err);

        toast({
          title: "Error approving nft contract",
          description: err?.data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return approveMutation;
}

export function usePurchaseNFT() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const nftContract = useHermesNftContract();
  const toast = useToast();

  const purchaseMutation = useMutation(
    async (amount: string) => {
      if (!account) throw new Error("No connected account");

      const tx = await nftContract.buy(amount);
      await tx.wait();

      return amount;
    },

    {
      onSuccess: (amount: string) => {
        queryClient.invalidateQueries(["hermes-heroes", account]);

        ReactGA.event({
          category: "NFT Purchase",
          action: `NFT purchased`,
          label: account,
          value: parseInt(amount, 10),
        });
      },

      onError: (err: any) => {
        console.error(`[usePurchaseNFT][error] general error `, err);

        toast({
          title: "Error purchasing nft",
          description: err?.data?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return purchaseMutation;
}

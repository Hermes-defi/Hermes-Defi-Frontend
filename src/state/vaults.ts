import { useMutation, useQueries, useQueryClient } from "react-query";
import {
  useCustomMasterChef,
  useUniPair,
  useVaultContract,
  useDfynFarmContract,
} from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { usePlutusPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Vault, vaults } from "config/vaults";
import { farms } from "config/farms";
import { BigNumber, utils } from "ethers";
import { fetchPairPrice, fetchPrice } from "web3-functions/prices";
import { approveLpContract } from "web3-functions";
import { getVaultApy, getVaultDualApy } from "web3-functions/utils";

function useFetchVaultsRequest() {
  const getMasterChef = useCustomMasterChef();
  const getVaultContract = useVaultContract();
  const getPairContract = useUniPair();
  const getDfynFarmContract = useDfynFarmContract();
  const { account, library } = useActiveWeb3React();

  return async (vault: Vault) => {
    try {
      const vaultContract = getVaultContract(vault.address);

      vault.totalStaked = utils.formatUnits(
        await vaultContract.balance(),
        vault.stakeToken.decimals
      );

      // get prices
      const lpContract = getPairContract(vault.stakeToken.address);
      const totalSupply = utils.formatUnits(
        await lpContract.totalSupply(),
        vault.stakeToken.decimals
      );

      vault.stakeToken.price = await fetchPairPrice(
        vault.pairs[0],
        vault.pairs[1],
        totalSupply,
        library,
        vault.amm
      );

      if (vault.isActive) {
        if (vault.amm === "dfyn") {
          vault.dfynRewardTokens[0].price = await fetchPrice(vault.dfynRewardTokens[0], library);
          vault.dfynRewardTokens[1].price = await fetchPrice(vault.dfynRewardTokens[1], library);

          const dfynFarm = getDfynFarmContract(vault.farmAddress);

          const token0RewardRate = (
            await dfynFarm.tokenRewardRate(vault.dfynRewardTokens[0].address)
          ).toString();

          const token1RewardRate = (
            await dfynFarm.tokenRewardRate(vault.dfynRewardTokens[1].address)
          ).toString();

          const totalStakedInFarm = utils.formatUnits(
            await lpContract.balanceOf(dfynFarm.address),
            await lpContract.decimals()
          );

          const apy = await getVaultDualApy({
            address: vault.stakeToken.address,
            stakePrice: vault.stakeToken.price,
            totalStakedInFarm,
            token0RewardRate,
            token0Price: vault.dfynRewardTokens[0].price,
            token0Decimals: vault.dfynRewardTokens[0].decimals,
            token1RewardRate,
            token1Price: vault.dfynRewardTokens[1].price,
            token1Decimals: vault.dfynRewardTokens[1].decimals,
            performanceFee: vault.performanceFee,
          });

          vault.apy = {
            yearly: apy.totalApy * 100,
            daily: (apy.vaultApr / 365) * 100,
          };
        } else {
          const masterChef = getMasterChef(vault.masterChefAddress);
          vault.projectToken.price = await fetchPrice(vault.projectToken, library);

          // caculate apy
          const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();
          const farmInfo = await masterChef.poolInfo(vault.farmPid);

          const multiplier = farmInfo.allocPoint.toString();
          const depositFees = BigNumber.from(farmInfo.depositFeeBP).div(100).toNumber();
          const farmLpContract = getPairContract(farmInfo.lpToken);

          const totalStakedInFarm = utils.formatUnits(
            await farmLpContract.balanceOf(masterChef.address),
            await farmLpContract.decimals()
          );

          const apy = await getVaultApy({
            address: farmLpContract.address,
            multiplier,
            tokenPerBlock: vault.tokenPerBlock,
            totalAllocPoints,
            depositFees,
            performanceFee: vault.performanceFee,
            rewardToken: vault.projectToken,
            stakeToken: vault.stakeToken,
            totalStakedInFarm,
          });

          vault.apy = {
            yearly: apy.totalApy * 100,
            daily: (apy.vaultApr / 365) * 100,
          };
        }
      } else {
        vault.apy = {
          yearly: 0,
          daily: 0,
        };
      }

      // USER data
      if (account) {
        let userShares = await vaultContract.balanceOf(account);
        let pricePerShare = await vaultContract.getPricePerFullShare();

        userShares = utils.formatUnits(userShares, vault.stakeToken.decimals);
        pricePerShare = utils.formatEther(pricePerShare);

        vault.userTotalStaked = new BigNumberJS(userShares).times(pricePerShare).toString();
        vault.userAvailableToUnstake = new BigNumberJS(userShares).toFixed(5).toString();

        vault.hasStaked = !new BigNumberJS(vault.userTotalStaked).isZero();

        const allowance: BigNumber = await lpContract.allowance(account, vault.address);
        vault.hasApprovedPool = !allowance.isZero();
      }

      return vault;
    } catch (err) {
      console.error(err);
      return vault;
    }
  };
}

export function useFetchVaults() {
  const plutusPrice = usePlutusPrice();
  const fetchVaultRq = useFetchVaultsRequest();
  const { account } = useActiveWeb3React();

  const vaultQueries = useQueries(
    vaults.map((vault) => {
      return {
        enabled: !!plutusPrice.data,
        queryKey: ["vault", vault.address, account],
        queryFn: () => fetchVaultRq(vault),
      };
    })
  );

  return vaultQueries;
}

export function useApproveVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getPairContract = useUniPair();
  const toast = useToast();

  const approveMutation = useMutation(
    async (address: string) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", address, account]);
      const lpContract = getPairContract(vault.stakeToken.address);

      await approveLpContract(lpContract, vault.address);
      return address;
    },

    {
      onSuccess: (address) => {
        const vault = queryClient.getQueryData<Vault>(["vault", address, account]);

        queryClient.setQueryData(["vault", address, account], {
          ...vault,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving ${vault.stakeToken.symbol}`,
          label: vault.stakeToken.symbol,
        });
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

export function useDepositIntoVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount }: { id: number; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.deposit(utils.parseUnits(amount, vault.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing ${vault.stakeToken.symbol} into Vault`,
          value: parseInt(amount, 10),
          label: vault.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositIntoVault][error] general error`, {
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

export function useWithdrawFromVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount }: { id: string; amount: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.withdraw(utils.parseUnits(amount, vault.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { amount, id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          value: parseInt(amount, 10),
          label: vault.stakeToken.symbol,
        });
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

export function useWithdrawAllFromVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id }: { id: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const tx = await vaultContract.withdrawAll();
      await tx.wait();
    },
    {
      onSuccess: (_, { id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
        queryClient.invalidateQueries(["vault", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          label: vault.stakeToken.symbol,
        });
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

import { useMutation, useQueries, useQueryClient } from "react-query";
import { useMasterChef, useUniPair, useVaultContract } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { useIrisPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Vault, vaults } from "config/vaults";
import { farms } from "config/farms";
import { BigNumber, utils } from "ethers";
import { Token } from "quickswap-sdk";
import { DEFAULT_CHAIN_ID, irisPerBlock, secondsPerBlock, secondsPerWeek } from "config/constants";
import { fetchPairPrice } from "web3-functions/prices";
import { approveLpContract } from "web3-functions";
import { getPoolApr } from "web3-functions/utils";

function useFetchVaultsRequest() {
  const masterChef = useMasterChef();
  const getVaultContract = useVaultContract();
  const getPairContract = useUniPair();
  const { account, library } = useActiveWeb3React();

  return async (vault: Vault) => {
    try {
      const vaultContract = getVaultContract(vault.address);

      vault.totalStaked = utils.formatUnits(
        await vaultContract.balance(),
        vault.stakeToken.decimals
      );

      // get price
      const lpContract = getPairContract(vault.stakeToken.address);
      const totalSupply = utils.formatUnits(
        await lpContract.totalSupply(),
        vault.stakeToken.decimals
      );

      const token0 = new Token(
        DEFAULT_CHAIN_ID,
        vault.pairs[0].tokenAddress,
        vault.pairs[0].tokenDecimals,
        vault.pairs[0].tokenName
      );

      const token1 = new Token(
        DEFAULT_CHAIN_ID,
        vault.pairs[1].tokenAddress,
        vault.pairs[1].tokenDecimals,
        vault.pairs[1].tokenName
      );

      vault.stakeToken.price = await fetchPairPrice(
        token0,
        token1,
        totalSupply,
        library,
        vault.amm
      );

      // apr
      const rewardsPerWeek = irisPerBlock * (secondsPerWeek / secondsPerBlock);
      const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

      // caculate apy
      const vaultFarm = farms.find((f) => f.pid === vault.farmPid);
      const farmInfo = await masterChef.poolInfo(vault.farmPid);

      const multiplier = farmInfo.allocPoint.toString();
      const depositFees = BigNumber.from(farmInfo.depositFeeBP).div(100).toNumber();
      const farmLpContract = getPairContract(farmInfo.lpToken);

      const totalStakedInFarm = utils.formatUnits(
        await farmLpContract.balanceOf(masterChef.address),
        vaultFarm.stakeToken.decimals
      );

      const poolRewardsPerWeek = new BigNumberJS(multiplier)
        .div(totalAllocPoints)
        .times(rewardsPerWeek)
        .times(1 - (depositFees ?? 0))
        .toNumber();

      const apr = getPoolApr(
        parseFloat(vault.stakeToken.price),
        poolRewardsPerWeek,
        parseFloat(vault.stakeToken.price),
        parseFloat(totalStakedInFarm)
      );

      const apy = (() => {
        const r = apr.yearlyAPR / 100;
        const n = 4890;
        const t = 1;
        const c = 1 - vault.performanceFee;

        const v = new BigNumberJS(r).times(c);
        const v1 = v.dividedBy(n);

        const pow = new BigNumberJS(n).times(t);
        const f = v1.plus(1).pow(pow);

        return f.times(100).toString();
      })();

      vault.apy = {
        yearly: apy,
        daily: apr.dailyAPR.toString(),
      };

      // USER data
      if (account) {
        const userStaked = await vaultContract.balanceOf(account);
        vault.userTotalStaked = utils.formatUnits(userStaked, vault.stakeToken.decimals);

        vault.hasStaked = !(userStaked as BigNumber).isZero();

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
  const irisPrice = useIrisPrice();
  const fetchVaultRq = useFetchVaultsRequest();
  const { account } = useActiveWeb3React();

  const vaultQueries = useQueries(
    vaults.map((vault) => {
      return {
        enabled: !!irisPrice.data,
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
    async ({ id, amount }: { id: number; amount: string }) => {
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

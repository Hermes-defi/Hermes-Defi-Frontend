import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useUniPair, useVaultContract, useVaultZapContract, useMasterChef, useERC20 } from "hooks/contracts";
import { useActiveWeb3React } from "wallet";
import { usePlutusPrice } from "hooks/prices";
import { useToast } from "@chakra-ui/react";

import ReactGA from "react-ga";
import BigNumberJS from "bignumber.js";
import { Vault, vaults } from "config/vaults";
import { BigNumber, utils } from "ethers";
import { fetchPairPrice } from "web3-functions/prices";
import { approveLpContract, getTokenBalance } from "web3-functions";
import { WRAPPED_NATIVE_TOKEN_ADDRESS, SECONDS_PER_WEEK, BLOCK_TIME } from "config/constants";

const RouterAddr = "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506";

export function useFetchVaults({ initialVaults }) {
  const plutusPrice = usePlutusPrice();

  const vaultQueries = useQueries(
    vaults.map((vault) => {
      return {
        enabled: !!plutusPrice.data,
        queryKey: ["vault", vault.address],
        queryFn: async () => {
          const resp = await fetch(`/api/app/vaults?vaultAddress=${vault.address}`);
          const payload = await resp.json();
          return payload;
        },
        initialData: initialVaults?.find((v) => vault.address === v.address),
      };
    })
  );

  return vaultQueries;
}

export function useFetchVaultsUserDetails(vaultAddress: string) {
  const plutusPrice = usePlutusPrice();
  const getLpContract = useERC20();
  const getVaultContract = useVaultContract();
  const { account } = useActiveWeb3React();

  return useQuery({
    enabled: !!plutusPrice.data && !!account,
    queryKey: ["vault-user-details", vaultAddress, account],
    queryFn: async () => {
      const userInfo: any = {};
      const vault = vaults.find((v) => v.address === vaultAddress);
      const vaultContract = getVaultContract(vaultAddress);
      const lpContract = getLpContract(vault.stakeToken.address);

      let userShares = await vaultContract.balanceOf(account);
      let pricePerShare = await vaultContract.getPricePerFullShare();

      userShares = utils.formatUnits(userShares, vault.stakeToken.decimals);
      pricePerShare = utils.formatEther(pricePerShare);

      userInfo.userTotalStaked = new BigNumberJS(userShares).times(pricePerShare).toString();
      userInfo.userAvailableToUnstake = new BigNumberJS(userShares).toFixed(5).toString();

      userInfo.hasStaked = !new BigNumberJS(vault.userTotalStaked).isZero();

      // get allowances
      let tokens = [vault.stakeToken, ...vault.pairs];
      const hasNativeHrc20 = tokens.find((token) => token.address === WRAPPED_NATIVE_TOKEN_ADDRESS);
      if (hasNativeHrc20) tokens.push({ address: "native", decimals: 18, symbol: "ONE" });

      if (vault.zapAddress) {
        const zapAllowance: BigNumber = await lpContract.allowance(account, vault.zapAddress);
        userInfo.hasApprovedZap = !zapAllowance.isZero();
      }

      const approvedTokens = await Promise.all(
        tokens.map(async (token) => {
          // get allowance
          if (token.address === "native") return token.address;

          if (vault.zapAddress && token.address !== vault.stakeToken.address) {
            const contract = getLpContract(token.address);
            const allowance: BigNumber = await contract.allowance(account, vault.zapAddress);
            return !allowance.isZero() ? token.address : null;
          }

          const contract = getLpContract(token.address);
          const allowance: BigNumber = await contract.allowance(account, vault.address);
          return !allowance.isZero() ? token.address : null;
        })
      );
      userInfo.approvedTokens = approvedTokens.filter((token) => !!token);

      const balance = await getTokenBalance(lpContract, account, vault.stakeToken.decimals);
      userInfo.hasWalletBalance = balance === "0.0" ? false : true;

      const allowance: BigNumber = await lpContract.allowance(account, vault.address);
      userInfo.hasApprovedPool = !allowance.isZero();

      return userInfo;
    },
  });
}

export function useFetchVaultStaking(vaultAddress: string, pid: number) {
  const masterChef = useMasterChef();
  const plutusPrice = usePlutusPrice();
  const getLpContract = useERC20();
  const getVaultContract = useVaultContract();
  const { account, library } = useActiveWeb3React();

  const query = useQuery({
    enabled: !!plutusPrice.data && !!pid,
    queryKey: ["vault-reciept-staking", vaultAddress, pid, account],
    queryFn: async () => {
      const poolData: any = {};

      try {
        // Farm data
        let masterChefInfo = await masterChef.poolInfo(pid);
        poolData.multiplier = masterChefInfo.allocPoint.toString();
        poolData.depositFees = BigNumber.from(masterChefInfo.depositFeeBP).div(100).toNumber();

        const vaultContract = getVaultContract(vaultAddress);
        poolData.totalStaked = utils.formatUnits(await vaultContract.balanceOf(masterChef.address), 18);

        // get reward token price and yearly value
        const rewardPerBlock = utils.formatUnits(await masterChef.tokenPerBlock(), 18);
        const rewardsPerWeek = new BigNumberJS(rewardPerBlock).times(SECONDS_PER_WEEK).dividedBy(BLOCK_TIME);
        const totalAllocPoints = (await masterChef.totalAllocPoint()).toNumber();

        const poolRewardsPerWeek = new BigNumberJS(poolData.multiplier).div(totalAllocPoints).times(rewardsPerWeek);
        const poolRewardsPerYear = poolRewardsPerWeek.times(52); // * 52 weeks
        const poolRewardsPerYearInUSD = poolRewardsPerYear.times(plutusPrice.data);

        // get vault data
        const vault = vaults.find((v) => v.address === vaultAddress);
        const pricePerShare = utils.formatUnits(await vaultContract.getPricePerFullShare(), 18);

        // get deposit token price
        const vaultLpContract = getLpContract(vault.stakeToken.address);
        const vaultTotalSupply = utils.formatUnits(await vaultLpContract.totalSupply(), vault.stakeToken.decimals);
        const depositTokenPrice = await fetchPairPrice(vault.pairs[0], vault.pairs[1], vaultTotalSupply, library, vault.amm);
        const depositTokenStaked = new BigNumberJS(poolData.totalStaked);
        const depositTokenStakedInUsd = depositTokenStaked.times(depositTokenPrice).times(pricePerShare);

        // get APR
        const apr = poolRewardsPerYearInUSD.dividedBy(depositTokenStakedInUsd);
        poolData.apr = {
          yearlyAPR: apr.times(100).toFixed(2),
          weeklyAPR: apr.times(100).dividedBy(52).toFixed(2),
          dailyAPR: apr.times(100).dividedBy(365).toFixed(2),
        };

        if (account) {
          poolData.rewardsEarned = utils.formatEther(await masterChef.pendingApollo(pid, account));

          const userInfo = await masterChef.userInfo(pid, account);
          poolData.userTotalStaked = utils.formatUnits(userInfo.amount, 18);
          poolData.hasStaked = !(userInfo.amount as BigNumber).isZero();

          const allowance: BigNumber = await vaultContract.allowance(account, masterChef.address);
          poolData.hasApprovedPool = !allowance.isZero();
        }

        return poolData;
      } catch (err) {
        console.error(err);
        return poolData;
      }
    },
  });

  return query;
}

export function useApproveVault() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getPairContract = useUniPair();
  const toast = useToast();

  const approveMutation = useMutation(
    async ({ address, tokenAddress }: { address: string; tokenAddress?: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", address]);

      if (vault.zapAddress && vault.stakeToken.address !== tokenAddress) {
        const lpContract = getPairContract(tokenAddress);
        await approveLpContract(lpContract, vault.zapAddress);
      } else {
        const lpContract = getPairContract(tokenAddress);
        await approveLpContract(lpContract, vault.address);
      }

      return { address, tokenAddress };
    },

    {
      onSuccess: ({ address, tokenAddress }) => {
        const userInfo: any = queryClient.getQueryData(["vault-user-details", address, account]);
        queryClient.setQueryData(["vault-user-details", address, account], {
          ...userInfo,
          approvedTokens: userInfo.approvedTokens.concat(tokenAddress),
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving vault - ${tokenAddress}`,
          label: tokenAddress,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApproveVault][error] general error `, {
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

export function useApproveVaultZap() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getPairContract = useUniPair();
  const toast = useToast();

  const approveMutation = useMutation(
    async ({ address }: { address: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", address]);
      const lpContract = getPairContract(vault.stakeToken.address);

      await approveLpContract(lpContract, vault.zapAddress);
      return { address };
    },

    {
      onSuccess: ({ address }) => {
        const userInfo = queryClient.getQueryData<any>(["vault-user-details", address, account]);
        queryClient.setQueryData(["vault-user-details", address, account], {
          ...userInfo,
          hasApprovedZap: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approving vault zap`,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApproveVaultZap][error] general error `, {
          data,
        });

        toast({
          title: "Error approving vault zap for token",
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

export function useApprovePStake() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const approveMutation = useMutation(
    async (vaultAddress: string) => {
      if (!account) throw new Error("No connected account");

      const vaultContract = getVaultContract(vaultAddress);
      await approveLpContract(vaultContract, masterChef.address);

      return vaultAddress;
    },

    {
      onSuccess: (vaultAddress) => {
        const vault = queryClient.getQueryData<Vault>(["vault", vaultAddress]);
        const vaultStaking = queryClient.getQueryData<Vault>(["vault-reciept-staking", vaultAddress, vault.rewardToken.poolId, account]);

        queryClient.setQueryData(["vault-reciept-staking", vaultAddress, vault.rewardToken.poolId, account], {
          ...vaultStaking,
          hasApprovedPool: true,
        });

        ReactGA.event({
          category: "Approval",
          action: `Approved ${vault.rewardToken.symbol}`,
          label: vault.rewardToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useApprovePStake][error] general error `, {
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
  const getVaultZapContract = useVaultZapContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, amount, tokenAddress }: { id: string; amount: string; tokenAddress?: string }) => {
      if (!account) throw new Error("No connected account");

      // convert amount to number
      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);

      if (vault.zapAddress && tokenAddress !== vault.stakeToken.address) {
        const zapContract = getVaultZapContract(vault.zapAddress);

        let tx: any;
        if (tokenAddress === "native") {
          const newAmount = parseFloat(amount).toFixed(18);
          tx = await zapContract.zapInAndStake(
            vault.stakeToken.address,
            RouterAddr,
            [WRAPPED_NATIVE_TOKEN_ADDRESS, vault.pairs[0].address],
            [WRAPPED_NATIVE_TOKEN_ADDRESS, vault.pairs[1].address],
            {
              value: utils.parseUnits(newAmount, 18),
            }
          );
        } else {
          const token = vault.pairs.find((p) => p.address === tokenAddress);
          const newAmount = parseFloat(amount).toFixed(token.decimals);
          tx = await zapContract.zapInTokenAndStake(
            tokenAddress,
            utils.parseUnits(newAmount, token.decimals),
            vault.stakeToken.address,
            RouterAddr,
            [tokenAddress, vault.pairs[0].address],
            [tokenAddress, vault.pairs[1].address]
          );
        }

        return await tx.wait();
      }

      const newAmount = parseFloat(amount).toFixed(vault.stakeToken.decimals);
      const vaultContract = getVaultContract(vault.address);
      const tx = await vaultContract.deposit(utils.parseUnits(newAmount, vault.stakeToken.decimals));
      await tx.wait();
    },
    {
      onSuccess: (_, { id, amount, tokenAddress }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id]);

        queryClient.invalidateQueries(["vault", id]);
        queryClient.invalidateQueries(["tokenBalance", account, tokenAddress]);
        queryClient.invalidateQueries(["vault-user-details", id, account]);

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

export function useDepositAllIntoVault() {
  const { account, library } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const getVaultContract = useVaultContract();
  const getVaultZapContract = useVaultZapContract();
  const getPairContract = useUniPair();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ id, tokenAddress }: { id: string; tokenAddress?: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);

      let balance: any;
      if (tokenAddress === "native") {
        balance = library.getBalance(account);
      } else {
        const lpContract = getPairContract(tokenAddress);
        balance = await lpContract.balanceOf(account);
      }

      if (vault.zapAddress && tokenAddress !== vault.stakeToken.address) {
        const zapContract = getVaultZapContract(vault.zapAddress);

        let tx: any;
        if (tokenAddress === "native") {
          tx = await zapContract.zapInAndStake(
            vault.stakeToken.address,
            RouterAddr,
            [WRAPPED_NATIVE_TOKEN_ADDRESS, vault.pairs[0].address],
            [WRAPPED_NATIVE_TOKEN_ADDRESS, vault.pairs[1].address],
            {
              value: balance,
            }
          );
        } else {
          const token = vault.pairs.find((p) => p.address === tokenAddress);
          console.log(token);
          tx = await zapContract.zapInTokenAndStake(
            tokenAddress,
            balance,
            vault.stakeToken.address,
            RouterAddr,
            [tokenAddress, vault.pairs[0].address],
            [tokenAddress, vault.pairs[1].address]
          );
        }

        return await tx.wait();
      }

      const vaultContract = getVaultContract(vault.address);
      const tx = await vaultContract.deposit(balance);
      await tx.wait();
    },
    {
      onSuccess: (_, { id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id]);
        queryClient.invalidateQueries(["vault", id]);
        queryClient.invalidateQueries(["tokenBalance", account, vault.stakeToken.address]);
        queryClient.invalidateQueries(["vault-user-details", id, account]);

        ReactGA.event({
          category: "Deposits",
          action: `Depositing all ${vault.stakeToken.symbol} into vault`,
          label: vault.stakeToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositAll][error] general error`, {
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

export function useDepositPStakeToken() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const getVaultContract = useVaultContract();
  const toast = useToast();

  const depositMutation = useMutation(
    async ({ vaultAddress, pid, harvesting }: { vaultAddress: string; pid: number; harvesting?: boolean }) => {
      if (!account) throw new Error("No connected account");

      const vaultContract = getVaultContract(vaultAddress);
      const amount = harvesting ? utils.parseEther("0") : await vaultContract.balanceOf(account);
      const tx = await masterChef.deposit(pid, amount);
      await tx.wait();
    },
    {
      onSuccess: (_, { vaultAddress }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", vaultAddress, account]);
        queryClient.invalidateQueries(["vault-reciept-staking", vaultAddress, vault.rewardToken.poolId, account]);
        queryClient.invalidateQueries(["tokenBalance", account, vaultAddress]);

        ReactGA.event({
          category: "Deposits",
          action: `Deposied ${vault.rewardToken.symbol} into MasterChef`,
          label: vault.rewardToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositPStakeToken][error] general error`, { data });

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
  const getVaultZapContract = useVaultZapContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, amount, tokenAddress }: { id: string; amount: string; tokenAddress?: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);

      // withdraw LP

      const newAmount = parseFloat(amount).toFixed(vault.stakeToken.decimals);
      const vaultContract = getVaultContract(vault.address);
      const tx = await vaultContract.withdraw(utils.parseUnits(newAmount, vault.stakeToken.decimals));
      await tx.wait();

      if (vault.zapAddress && tokenAddress !== vault.stakeToken.address) {
        const zapContract = getVaultZapContract(vault.zapAddress);

        let tx: any;
        if (tokenAddress === "native") {
          const newAmount = parseFloat(amount).toFixed(18);
          tx = await zapContract.zapOut(
            vault.stakeToken.address,
            utils.parseUnits(newAmount, 18),
            RouterAddr,
            account,
            [vault.pairs[0].address, WRAPPED_NATIVE_TOKEN_ADDRESS],
            [vault.pairs[1].address, WRAPPED_NATIVE_TOKEN_ADDRESS]
          );
        } else {
          const token = vault.pairs.find((p) => p.address === tokenAddress);

          const newAmount = parseFloat(amount).toFixed(token.decimals);
          tx = await zapContract.zapOutToken(
            vault.stakeToken.address,
            utils.parseUnits(newAmount, token.decimals),
            token.address,
            RouterAddr,
            [vault.pairs[0].address, tokenAddress],
            [vault.pairs[1].address, tokenAddress]
          );
        }

        return await tx.wait();
      }
    },
    {
      onSuccess: (_, { amount, id, tokenAddress }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id]);

        queryClient.invalidateQueries(["vault", id]);
        queryClient.invalidateQueries(["tokenBalance", account, tokenAddress]);
        queryClient.invalidateQueries(["vault-user-details", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          value: parseInt(amount, 10),
          label: vault.stakeToken.symbol,
        });
      },

      onError: (err: any) => {
        const { data } = err;
        console.error(`[useWithdraw][error] general error`, {
          err,
        });

        toast({
          title: "Error withdrawing token",
          description: data?.message || err?.message,
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
  const getVaultZapContract = useVaultZapContract();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ id, tokenAddress }: { id: string; tokenAddress: string }) => {
      if (!account) throw new Error("No connected account");

      const vault = queryClient.getQueryData<Vault>(["vault", id, account]);
      const vaultContract = getVaultContract(vault.address);

      const balance = await vaultContract.balanceOf(account);
      const tx = await vaultContract.withdraw(balance);
      await tx.wait();

      if (vault.zapAddress && tokenAddress !== vault.stakeToken.address) {
        const zapContract = getVaultZapContract(vault.zapAddress);

        let tx: any;
        if (tokenAddress === "native") {
          tx = await zapContract.zapOut(
            vault.stakeToken.address,
            balance,
            RouterAddr,
            account,
            [vault.pairs[0].address, WRAPPED_NATIVE_TOKEN_ADDRESS],
            [vault.pairs[1].address, WRAPPED_NATIVE_TOKEN_ADDRESS]
          );
        } else {
          const token = vault.pairs.find((p) => p.address === tokenAddress);
          tx = await zapContract.zapOutToken(
            vault.stakeToken.address,
            balance,
            token.address,
            RouterAddr,
            [vault.pairs[0].address, tokenAddress],
            [vault.pairs[1].address, tokenAddress]
          );
        }

        return await tx.wait();
      }
    },
    {
      onSuccess: (_, { id }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", id]);
        queryClient.invalidateQueries(["vault", id]);
        queryClient.invalidateQueries(["tokenBalance", account, vault.stakeToken.address]);
        queryClient.invalidateQueries(["vault-user-details", id, account]);

        ReactGA.event({
          category: "Withdrawals",
          action: `Withdrawing ${vault.stakeToken.symbol} from vault`,
          label: vault.stakeToken.symbol,
        });
      },

      onError: (err: any) => {
        const { data } = err;
        console.error(`[useWithdrawAll][error] general error`, {
          err,
        });

        toast({
          title: "Error withdrawing token",
          description: data?.message || err?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return withdrawMutation;
}

export function useWithdrawPStakeToken() {
  const { account } = useActiveWeb3React();
  const queryClient = useQueryClient();
  const masterChef = useMasterChef();
  const toast = useToast();

  const withdrawMutation = useMutation(
    async ({ pid }: { vaultAddress: string; pid: number }) => {
      if (!account) throw new Error("No connected account");

      const userInfo = await masterChef.userInfo(pid, account);
      const tx = await masterChef.withdraw(pid, userInfo.amount);
      await tx.wait();
    },
    {
      onSuccess: (_, { vaultAddress }) => {
        const vault = queryClient.getQueryData<Vault>(["vault", vaultAddress, account]);

        queryClient.invalidateQueries(["vault", vaultAddress, account]);
        queryClient.invalidateQueries(["vault-reciept-staking", vaultAddress, vault.rewardToken.poolId, account]);
        queryClient.invalidateQueries(["tokenBalance", account, vaultAddress]);

        ReactGA.event({
          category: "Deposits",
          action: `Deposied ${vault.rewardToken.symbol} into MasterChef`,
          label: vault.rewardToken.symbol,
        });
      },

      onError: ({ data }) => {
        console.error(`[useDepositPStakeToken][error] general error`, { data });

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

  return withdrawMutation;
}

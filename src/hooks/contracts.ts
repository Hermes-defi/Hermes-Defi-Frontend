import defaultContracts, { erc20, ContractInfo, uniPair, stakePool, vault, dfynFarm, rewardPools, dualRewardPools } from "config/contracts";
import { utils, providers, constants, Contract } from "ethers";
import { useCallback } from "react";
import { useActiveWeb3React } from "wallet";

export function useContract() {
  const { library, account } = useActiveWeb3React();

  return useCallback(
    (contractInfo: ContractInfo) => {
      if (!library) {
        console.log("[useContract][error] Library is not ready");
        return null;
      }

      const address = contractInfo.address;
      const abi = contractInfo.abi;

      if (!utils.isAddress(address) || address === constants.AddressZero) {
        console.error(`[useContract][error] Invalid 'address' parameter '${address}'.`);
        return null;
      }

      let provider: providers.Web3Provider | providers.JsonRpcSigner = library;
      if (account) {
        provider = library.getSigner(account).connectUnchecked();
      }

      return new Contract(address, abi, provider);
    },
    [account, library]
  );
}

export function useMasterChef() {
  const contract = useContract();
  return contract(defaultContracts.masterChef);
}

export function useIrisToken() {
  const contract = useContract();
  return contract(defaultContracts.irisToken);
}

export function useApolloToken() {
  const contract = useContract();
  return contract(defaultContracts.apolloToken);
}

export function useReferral() {
  const contract = useContract();
  return contract(defaultContracts.referral);
}

export function useFenix() {
  const contract = useContract();
  return contract(defaultContracts.fenixToken);
}

export function useRedeem() {
  const contract = useContract();
  return contract(defaultContracts.redeem);
}

export function useERC20_v2(address: string) {
  const contract = useContract();
  const erc20ContractInfo = erc20(address);
  return contract(erc20ContractInfo);
}

export function useERC20() {
  const contract = useContract();

  return (address: string) => {
    const erc20ContractInfo = erc20(address);
    return contract(erc20ContractInfo);
  };
}

export function useUniPair() {
  const contract = useContract();

  return (address: string) => {
    const uniPairContractInfo = uniPair(address);
    return contract(uniPairContractInfo);
  };
}

export function useStakePoolContract() {
  const contract = useContract();

  return (address: string) => {
    const stakePoolContractInfo = stakePool(address);
    return contract(stakePoolContractInfo);
  };
}

export function useVaultContract() {
  const contract = useContract();

  return (address: string) => {
    const vaultInfo = vault(address);
    return contract(vaultInfo);
  };
}

export function useDfynFarmContract() {
  const contract = useContract();

  return (address: string) => {
    const dfynFarmInfo = dfynFarm(address);
    return contract(dfynFarmInfo);
  };
}

export function useHermesNftContract() {
  const contract = useContract();
  return contract(defaultContracts.hermesNft);
}

export function useCustomMasterChef() {
  const contract = useContract();

  return (address: string) => {
    return contract({
      abi: defaultContracts.masterChef.abi,
      address,
    });
  };
}

export function usePresaleContract(version: "v1" | "v2") {
  const contract = useContract();
  return contract(
    version === "v1" ? defaultContracts.apolloPresaleFirstRound : defaultContracts.apolloPresaleSecondRound
  );
}

export function usePApollo() {
  const contract = useContract();
  return contract(defaultContracts.pApollo);
}

export function useVaultRewardPoolContract() {
  const contract = useContract();

  return (address: string) => {
    const rewardPoolContractInfo = rewardPools(address);
    return contract(rewardPoolContractInfo);
  };
}

export function useVaultDualRewardPoolContract() {
  const contract = useContract();

  return (address: string) => {
    const rewardPoolContractInfo = dualRewardPools(address);
    return contract(rewardPoolContractInfo);
  };
}
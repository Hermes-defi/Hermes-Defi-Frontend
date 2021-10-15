import { useLayerValue } from "components/layer-manager";
import {
  erc20,
  ContractInfo,
  uniPair,
  stakePool,
  vault,
  dfynFarm,
  irisContracts,
  apolloContracts,
} from "config/contracts";
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
  return contract(useLayerValue(irisContracts.masterChef, apolloContracts.masterChef));
}

export function useIrisToken() {
  const contract = useContract();
  return contract(irisContracts.irisToken);
}

export function useApolloToken() {
  const contract = useContract();
  return contract(apolloContracts.apolloToken);
}

export function useReferral() {
  const contract = useContract();
  return contract(irisContracts.referral);
}

export function useFenix() {
  const contract = useContract();
  return contract(irisContracts.fenixToken);
}

export function useRedeem() {
  const contract = useContract();
  return contract(irisContracts.redeem);
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
  return contract(irisContracts.hermesNft);
}

export function useCustomMasterChef() {
  const contract = useContract();

  return (address: string) => {
    return contract({
      abi: irisContracts.masterChef.abi,
      address,
    });
  };
}

export function usePresaleContract(version: "v1" | "v2") {
  const contract = useContract();
  return contract(version === "v1" ? irisContracts.apolloPresaleFirstRound : irisContracts.apolloPresaleSecondRound);
}

export function usePApollo() {
  const contract = useContract();
  return contract(irisContracts.pApollo);
}

import defaultContracts, { erc20, ContractInfo } from "config/contracts";
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

export function useReferral() {
  const contract = useContract();
  return contract(defaultContracts.referral);
}

export function useERC20() {
  const contract = useContract();

  return (address: string) => {
    const erc20ContractInfo = erc20(address);
    return contract(erc20ContractInfo);
  };
}

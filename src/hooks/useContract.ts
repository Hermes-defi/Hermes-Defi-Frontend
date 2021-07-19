import { useCallback } from "react";

import { Contract, providers, utils, constants } from "ethers";
import { useActiveWeb3React } from "wallet";

import IrisTokenABI from "abis/IrisToken.json";
import MasterChefABI from "abis/MasterChef.json";
import ReferralABI from "abis/Referral.json";

export type ContractInfo = {
  address: string;
  abi: any;
};

export const defaultContracts = {
  referral: {
    address: "0x61dc8EAc3Ba928961F7Aa93e0d85CC74B0d74De1",
    abi: ReferralABI,
  },
  masterChef: {
    address: "0x8e073613bfdABaFF868844C4fb392ebd60D969c2",
    abi: MasterChefABI,
  },
  irisToken: {
    address: "0x4F5d217290fbC41862cbd5ee57938d5a6E4012E4",
    abi: IrisTokenABI,
  },
};

export function useGetContract() {
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

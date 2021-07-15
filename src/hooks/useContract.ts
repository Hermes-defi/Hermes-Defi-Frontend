import { useMemo } from "react";

import { Contract, providers, utils, constants } from "ethers";
import { useWeb3React } from "@web3-react/core";

import IrisTokenABI from "abis/IrisToken.json";
import MasterChefABI from "abis/MasterChef.json";
import ReferralABI from "abis/Referral.json";

const contracts = {
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

export enum ContractTypes {
  IRIS_TOKEN = "irisToken",
  MASTER_CHEF = "masterChef",
  REFERRAL = "referral",
}

export function useContract(contract: ContractTypes) {
  const { library, account } = useWeb3React<providers.Web3Provider>();

  return useMemo(() => {
    if (!library) return null;

    const address = contracts[contract].address;
    const abi = contracts[contract].abi;

    if (!utils.isAddress(address) || address === constants.AddressZero) {
      console.error(`[useContract][error] Invalid 'address' parameter '${address}'.`);
      return null;
    }

    let provider: providers.Web3Provider | providers.JsonRpcSigner = library;
    if (account) {
      provider = library.getSigner(account).connectUnchecked();
    }

    return new Contract(address, abi, provider);
  }, [account, library]);
}

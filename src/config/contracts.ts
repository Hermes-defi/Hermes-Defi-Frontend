import IrisTokenABI from "config/abis/IrisToken.json";
import MasterChefABI from "config/abis/MasterChef.json";
import ReferralABI from "config/abis/Referral.json";
import ERC20ABI from "config/abis/ERC20.json";

export type ContractInfo = {
  address: string;
  abi: any;
};

export const erc20: (address: string) => ContractInfo = (address: string) => ({
  abi: ERC20ABI,
  address,
});

export default {
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

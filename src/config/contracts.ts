import IrisTokenABI from "config/abis/IrisToken.json";
import MasterChefABI from "config/abis/MasterChef.json";
import ReferralABI from "config/abis/Referral.json";
import FenixABI from "config/abis/Fenix.json";
import RedeemABI from "config/abis/Redeem.json";
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
  fenixToken: {
    address: "0x807Be9676f72390bCaB19f914f770d9713a2d9e0",
    abi: FenixABI,
  },
  redeem: {
    address: "0xC481Cc926522A14Ed21077B8eEd85c7C0947F62e",
    abi: RedeemABI,
  },
};

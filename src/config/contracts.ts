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
    address: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    abi: ReferralABI,
  },
  masterChef: {
    address: "0xA3dc6b430A90D61e7f1C7800d43Bd67b8a06D597",
    abi: MasterChefABI,
  },
  irisToken: {
    address: "0x5EB25908Abf8764CB101bE704d6Bb4a8d5254f72",
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

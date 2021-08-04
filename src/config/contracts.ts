import IrisTokenABI from "config/abis/IrisToken.json";
import MasterChefABI from "config/abis/MasterChef.json";
import ReferralABI from "config/abis/Referral.json";
import FenixABI from "config/abis/Fenix.json";
import RedeemABI from "config/abis/Redeem.json";
import ERC20ABI from "config/abis/ERC20.json";
import { DEFAULT_CHAIN_ID } from "config/constants";

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
    address: {
      137: "0x24F3282A439EBd13a4F24fE8756a1d6aaC65570F",
      80001: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    }[DEFAULT_CHAIN_ID],
    abi: ReferralABI,
  },
  masterChef: {
    address: {
      137: "0xF2a544C1Ee9B21D6B068F638B5fB4835D8efBA3D",
      80001: "0xA3dc6b430A90D61e7f1C7800d43Bd67b8a06D597",
    }[DEFAULT_CHAIN_ID],
    abi: MasterChefABI,
  },
  irisToken: {
    address: {
      137: "0x86F74E2d74cC4eea54b744134Af586c9E11B0Bb3",
      80001: "0x5EB25908Abf8764CB101bE704d6Bb4a8d5254f72",
    }[DEFAULT_CHAIN_ID],
    abi: IrisTokenABI,
  },
  fenixToken: {
    address: {
      137: "0x41013D1521B20CA67397e7c65256bfb2975FAAc8",
      80001: "0x807Be9676f72390bCaB19f914f770d9713a2d9e0",
    }[DEFAULT_CHAIN_ID],
    abi: FenixABI,
  },
  redeem: {
    address: {
      137: "0x0C72A971AB0D85689bDd95810BE54dD0C3aB3Ab3",
      80001: "0xC481Cc926522A14Ed21077B8eEd85c7C0947F62e",
    }[DEFAULT_CHAIN_ID],
    abi: RedeemABI,
  },
};

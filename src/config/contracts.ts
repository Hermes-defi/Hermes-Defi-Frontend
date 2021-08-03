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
      137: "0x8a94E9Df811A1Dad50872C5d2d446ff79a566398",
      80001: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    }[DEFAULT_CHAIN_ID],
    abi: ReferralABI,
  },
  masterChef: {
    address: {
      137: "0x50DAedb6cF1b2C912e87dF28a5B9562Db984Fb92",
      80001: "0xA3dc6b430A90D61e7f1C7800d43Bd67b8a06D597",
    }[DEFAULT_CHAIN_ID],
    abi: MasterChefABI,
  },
  irisToken: {
    address: {
      137: "0x4C570E70010a5D006271a99706E0b0835Ed61745",
      80001: "0x5EB25908Abf8764CB101bE704d6Bb4a8d5254f72",
    }[DEFAULT_CHAIN_ID],
    abi: IrisTokenABI,
  },
  fenixToken: {
    address: {
      137: "0x855CF7E346647da1C6dc32b53B173BDa232c436E",
      80001: "0x807Be9676f72390bCaB19f914f770d9713a2d9e0",
    }[DEFAULT_CHAIN_ID],
    abi: FenixABI,
  },
  redeem: {
    address: {
      137: "0x8e1f5EE6D1D067d7f48B76BB4FA0D92a73C92Aa8",
      80001: "0xC481Cc926522A14Ed21077B8eEd85c7C0947F62e",
    }[DEFAULT_CHAIN_ID],
    abi: RedeemABI,
  },
};

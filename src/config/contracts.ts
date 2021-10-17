import ApolloABI from "config/abis/ApolloABI.json";
import IrisABI from "config/abis/IrisABI.json";
import MasterChefABI from "config/abis/MasterChef.json";
import ReferralABI from "config/abis/Referral.json";
import FenixABI from "config/abis/Fenix.json";
import RedeemABI from "config/abis/Redeem.json";
import ERC20ABI from "config/abis/ERC20.json";
import UNIPAIRABI from "config/abis/UNIPAIR.json";
import StakePoolABI from "config/abis/StakePool.json";
import VaultABI from "config/abis/Vault.json";
import DfynFarmABI from "config/abis/DfynFarm.json";
import HermesNFTABI from "config/abis/HermesNFT.json";
import pAPOLLO from "config/abis/pApollo.json";
import { DEFAULT_CHAIN_ID } from "config/constants";

export type ContractInfo = {
  address: string;
  abi: any;
};

export const erc20: (address: string) => ContractInfo = (address: string) => ({
  abi: ERC20ABI,
  address,
});

export const uniPair: (address: string) => ContractInfo = (address: string) => ({
  abi: UNIPAIRABI,
  address,
});

export const stakePool: (address: string) => ContractInfo = (address: string) => ({
  abi: StakePoolABI,
  address,
});

export const vault: (address: string) => ContractInfo = (address: string) => ({
  abi: VaultABI,
  address,
});

export const dfynFarm: (address: string) => ContractInfo = (address: string) => ({
  abi: DfynFarmABI,
  address,
});

const defaultContracts = {
  referral: {
    address: {
      137: "0xDC99FE88118CdE8316df10Eb16c722C3967e73Fd",
      80001: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    }[DEFAULT_CHAIN_ID],
    abi: ReferralABI,
  },
  masterChef: {
    address: {
      137: "0x8016ABeC77489bfD0A7f98DdEA3dF9DC73326cBa",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: MasterChefABI,
  },
  irisToken: {
    address: {
      137: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
      80001: "0x5EB25908Abf8764CB101bE704d6Bb4a8d5254f72",
    }[DEFAULT_CHAIN_ID],
    abi: IrisABI,
  },
  apolloToken: {
    address: {
      137: "0x87cf37B07a5f879c1af35532862e6229E90C72AF",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: ApolloABI,
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
  hermesNft: {
    address: {
      137: "0x6011b77d2dcba999f837d6609124fbcdc4ac3a4e",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: HermesNFTABI,
  },
  apolloPresaleFirstRound: {
    address: {
      137: "0xF8459eF698f7C6F6C2a5D80a80f92C8Ae6535d6E",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: pAPOLLO,
  },
  apolloPresaleSecondRound: {
    address: {
      137: "0xe08fA8F2b3531e82a6Bef397C5FA64c5d9d7B889",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: pAPOLLO,
  },
  pApollo: {
    address: {
      137: "0xE644Be5D4d5E7f16F0039cD67BCd438D1A62ef13",
      80001: "",
    }[DEFAULT_CHAIN_ID],
    abi: ERC20ABI,
  },
};

export default defaultContracts;

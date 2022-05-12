import PlutusTokenABI from "config/abis/PlutusToken.json";
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
import BankABI from "config/abis/Bank.json";
import UsdcSwapABI from "config/abis/UsdcSwap.json";
import PresaleABI from "config/abis/Presale.json";
import pPlutusTokenABI from "config/abis/pPlutusToken.json";
import StakeBankABI from "config/abis/StakeBank.json";
import MiniChefSushiABI from "config/abis/MiniChefSushi.json";
import ZapABI from "config/abis/Zap.json";
import oracleDFKABI from "config/abis/OracleDFK.json";
import DelegatorABI from "config/abis/Delegator.json";
import WoneBankABI from "config/abis/WoneBank.json";
import SwapHermesBankABI from "config/abis/SwapHermesBank.json";
import SwapHermesABI from "config/abis/SwapHermes.json";
import pHermesABI from "config/abis/pHermesToken.json";
import HermesABI from "config/abis/HermesToken.json";
import HermesRedeemABI from "config/abis/HermesRedeem.json";
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

export const stakeBank: (address: string) => ContractInfo = (address: string) => ({
  abi: StakeBankABI,
  address,
});

export const vault: (address: string) => ContractInfo = (address: string) => ({
  abi: VaultABI,
  address,
});

export const vaultZap: (address: string) => ContractInfo = (address: string) => ({
  abi: ZapABI,
  address,
});

export const dfynFarm: (address: string) => ContractInfo = (address: string) => ({
  abi: DfynFarmABI,
  address,
});

export const miniChefSushi: (address: string) => ContractInfo = (address: string) => ({
  abi: MiniChefSushiABI,
  address,
});

export const delegatorStake: (address: string) => ContractInfo = (address: string) => ({
  abi: DelegatorABI,
  address,
});

const defaultContracts = {
  referral: {
    address: {
      1666600000: "0xDC99FE88118CdE8316df10Eb16c722C3967e73Fd",
      1666700000: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    }[DEFAULT_CHAIN_ID],
    abi: ReferralABI,
  },
  masterChef: {
    address: {
      1666600000: "0x8c8dca27e450d7d93fa951e79ec354dce543629e",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: MasterChefABI,
  },
  plutusToken: {
    address: {
      1666600000: "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
      1666700000: "0x540c84a79F64ebC81636dB7FB0adf31D26a9b2FD",
    }[DEFAULT_CHAIN_ID],
    abi: PlutusTokenABI,
  },
  fenixToken: {
    address: {
      1666600000: "0x41013D1521B20CA67397e7c65256bfb2975FAAc8",
      1666700000: "0x807Be9676f72390bCaB19f914f770d9713a2d9e0",
    }[DEFAULT_CHAIN_ID],
    abi: FenixABI,
  },
  redeem: {
    address: {
      1666600000: "0x0C72A971AB0D85689bDd95810BE54dD0C3aB3Ab3",
      1666700000: "0xC481Cc926522A14Ed21077B8eEd85c7C0947F62e",
    }[DEFAULT_CHAIN_ID],
    abi: RedeemABI,
  },
  hermesNft: {
    address: {
      1666600000: "0x6011b77d2dcba999f837d6609124fbcdc4ac3a4e",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: HermesNFTABI,
  },
  // TODO: change bank address
  bank: {
    address: {
      1666600000: "0x4e4a491b028b90fb8870429c40d6172bba9145b1",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: BankABI,
  },
  // TODO: change plutusIDO address
  plutusIDO: {
    address: {
      1666600000: "0xae3b27d1d16b5364398266ac1dcafcdd22fe471f",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: PresaleABI,
  },
  swapUsdc: {
    address: {
      1666600000: "0x217aaa91e252b46e1abff0c8bab63249fbba881b",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: UsdcSwapABI,
  },

  pPlutus: {
    address: {
      1666600000: "0x6c322c67dcab641549066beb849538de3b1f8600",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: pPlutusTokenABI,
  },
  dfkOracle: {
    address: {
      1666600000: "0x9bA42cbB93Ff32A877cd9a62eb167Bf92e425668",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: oracleDFKABI,
  },
  woneBank: {
    address: {
      1666600000: "0xa19765e275669c1162b099c7c8553c23b779cd83",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: WoneBankABI,
  },
  woneTestBank: {
    address: {
      1666600000: "0xc2c57ea78582c65529C3445eF542985Abde90cd0",
      1666700000: "",
    }[DEFAULT_CHAIN_ID],
    abi: WoneBankABI,
  },
  swapHermesBank: {
    address: {
      1666600000: "",
      1666700000: "0x715a4f2cf7ddceda3bb7fbc81fb7c32f93129084",
    }[DEFAULT_CHAIN_ID],
    abi: SwapHermesBankABI,
  },
  swapHermes: {
    address: {
      1666600000: "",
      1666700000: "0xb4fae9e130ad60d6d8144de1e8ac1dc46ededc03",
    }[DEFAULT_CHAIN_ID],
    abi: SwapHermesABI,
  },
  pHermesToken: {
    address: {
      1666600000: "",
      1666700000: "0x8ab57b26c4988e65bd8f7ea2c01a2d34c3a6af35",
    }[DEFAULT_CHAIN_ID],
    abi: pHermesABI,
  },
  hermesToken: {
    address: {
      1666600000: "",
      1666700000: "0xa87436768a157e936e30124e6e942913b9d46e93",
    }[DEFAULT_CHAIN_ID],
    abi: HermesABI,
  },
  hermesRedeem: {
    address: {
      1666600000: "",
      1666700000: "0x38cc050e23a0afbaa62bcffc3d593367bc48cb97",
    }[DEFAULT_CHAIN_ID],
    abi: HermesRedeemABI,
  }
};

export default defaultContracts;

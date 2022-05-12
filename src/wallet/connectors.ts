import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { DEFAULT_CHAIN_ID } from "config/constants";

// CONSTANTS
export const RPC_URLS: { [chainId: number]: string } = {
  // 1666600000: "https://api.harmony.one", // main
  // 1666600000: "https://rpc.hermesdefi.io/", //wonderful hermes RPC by "el papá" Austin
  // 1666600000: "https://api.fuzz.fi/",
  1666600000: "https://harmony-0-rpc.gateway.pokt.network/",
  1666700000: "https://api.s0.b.hmny.io",
};

// CONNECTORS
export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
});

export const injected = new InjectedConnector({
  supportedChainIds: [DEFAULT_CHAIN_ID],
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [DEFAULT_CHAIN_ID],
  rpc: RPC_URLS,
  qrcode: true,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[DEFAULT_CHAIN_ID],
  appName: "HermesDefi",
});

interface WalletInfo {
  name: string;
  iconURL: string;
  description: string;
  href: string | null;
  color: string;
  connector?: any;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconURL: "",
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconURL: "/wallets/metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    iconURL: "/wallets/walletconnect.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: "Coinbase Wallet",
    iconURL: "/wallets/coinbase.svg",
    description: "Use Coinbase Wallet app on mobile device",
    href: null,
    color: "#315CF5",
  },
  COINBASE_LINK: {
    name: "Open in Coinbase Wallet",
    iconURL: "/wallets/coinbase.svg",
    description: "Open in Coinbase Wallet app.",
    href: "https://go.cb-w.com/mtUDhEZPy1",
    color: "#315CF5",
    mobile: true,
    mobileOnly: true,
  },
  // FORTMATIC: {
  //   //   connector: fortmatic,
  //   name: "Fortmatic",
  //   iconURL: "/wallets/fortmatic.png",
  //   description: "Login using Fortmatic hosted wallet",
  //   href: null,
  //   color: "#6748FF",
  //   mobile: true,
  // },
  // Portis: {
  //   //   connector: portis,
  //   name: "Portis",
  //   iconURL: "/wallets/portis.png",
  //   description: "Login using Portis hosted wallet",
  //   href: null,
  //   color: "#4A6C9B",
  //   mobile: true,
  // },
};

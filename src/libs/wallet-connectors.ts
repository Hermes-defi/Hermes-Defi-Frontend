import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

// CONSTANTS
const RPC_URLS: { [chainId: number]: string } = {
  137: "https://rpc-mainnet.matic.network",
  80001: "https://polygon-mumbai.infura.io/v3/93518d8fd18e494899c057da3bd5a35d",
};

// CONNECTORS
export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: 80001,
});

export const injected = new InjectedConnector({
  supportedChainIds: [137, 80001],
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [137, 80001],
  rpc: RPC_URLS,
  qrcode: true,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[80001],
  appName: "Uniswap",
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

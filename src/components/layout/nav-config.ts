export interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const L1_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/app",
  },
  {
    label: "NFT",
    href: "/app/nfts",
  },
  {
    label: "Governance",
    href: "https://snapshot.org/#/hermesdefi.eth",
    isExternal: true,
  },
  {
    label: "Layers",
    children: [
      {
        label: "Iris",
        href: "/app",
      },
      {
        label: "Plutus",
        href: "https://plutus.hermesdefi.io/app",
        isExternal: true,
      },
    ],
  },
  {
    label: "Trade",
    children: [
      {
        label: "Swap (QuickSwap)",
        href: "https://quickswap.exchange/#/swap?outputCurrency=0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        isExternal: true,
      },
      {
        label: "Liquidity (QuickSwap)",
        href: "https://quickswap.exchange/#/add/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
        isExternal: true,
      },
      {
        label: "Swap (Viper)",
        href: "https://viperswap.one/#/swap?outputCurrency=0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
        isExternal: true,
      },
      {
        label: "Liquidity (Viper)",
        href: "https://viperswap.one/#/add/ONE/0x85FD5f8dBD0c9Ef1806E6c7d4B787d438621C1dC",
        isExternal: true,
      },
    ],
  },
  {
    label: "Charts",
    children: [
      {
        label: "Defined",
        href: "https://www.defined.fi/matic/0x86ad6271809f350522085f95f5a67d46ff7ed3ab",
        isExternal: true,
      },
      {
        label: "DexGuru",
        href: "https://dex.guru/token/0xdab35042e63e93cc8556c9bae482e5415b5ac4b1-polygon",
        isExternal: true,
      },
      {
        label: "Arken",
        href: "https://swap.arken.finance/tokens/polygon/0xdab35042e63e93cc8556c9bae482e5415b5ac4b1",
        isExternal: true,
      },
    ],
  },

  {
    label: "Community",
    children: [
      {
        label: "Docs",
        href: "https://hermes-defi.gitbook.io/hermes-finance/",
        isExternal: true,
      },
      {
        label: "Github",
        href: "https://github.com/Hermes-defi",
        isExternal: true,
      },
      {
        label: "Discord",
        href: "https://discord.gg/CsNtpfFqST",
        isExternal: true,
      },
      {
        label: "Twitter",
        href: "https://twitter.com/hermesdefi",
        isExternal: true,
      },
      {
        label: "Medium",
        href: "https://medium.com/@HermesDefi",
        isExternal: true,
      },
      {
        label: "Youtube",
        href: "https://www.youtube.com/channel/UCnLWipB915XYPHMmMZcsnag",
        isExternal: true,
      },
    ],
  },
];

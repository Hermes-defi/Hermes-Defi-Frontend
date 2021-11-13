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
    label: "Products",
    children: [
      {
        label: "Stake PLUTUS",
        href: "/app/stake",
      },
      {
        label: "Vaults",
        href: "/app/vaults",
      },
      {
        label: "Stake god",
        href: "/app/vault-stake",
      },
    ],
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
        label: "Plutus",
        href: "/app",
      },
      {
        label: "Apollo",
        href: "https://apollo.hermesdefi.io/app",
        isExternal: true,
      },
    ],
  },
  {
    label: "Trade",
    children: [
      {
        label: "Swap (QuickSwap)",
        href: "https://quickswap.exchange/#/swap?outputCurrency=0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
      {
        label: "Liquidity (QuickSwap)",
        href: "https://quickswap.exchange/#/add/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
      {
        label: "Swap (Balancer)",
        href: "https://polygon.balancer.fi/#/trade",
        isExternal: true,
      },
      {
        label: "Liquidity (Balancer)",
        href: "https://polygon.balancer.fi/#/pool/0x7320d680ca9bce8048a286f00a79a2c9f8dcd7b3000100000000000000000044",
        isExternal: true,
      },
      {
        label: "Swap (Dfyn)",
        href: "https://exchange.dfyn.network/#/swap?inputCurrency=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&outputCurrency=0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
      {
        label: "Liquidity (Dfyn)",
        href: "https://exchange.dfyn.network/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
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
        href: "https://dex.guru/token/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B-polygon",
        isExternal: true,
      },
      {
        label: "Arken",
        href: "https://swap.arken.finance/tokens/polygon/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
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
        label: "Telegram",
        href: "https://t.me/hermesdefinance",
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
        label: "Pre Sale",
        href: "https://apollo.hermesdefi.io/app/pre-sale",
      },
    ],
  },
];

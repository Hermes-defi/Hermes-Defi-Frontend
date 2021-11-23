export interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const L3_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/app",
  },
  {
    label: "Products",
    children: [
      {
        label: "Pools",
        href: "/app/pools"
      },
      {
        label: "Farms",
        href: "/app/farms"
      },
      {
        label: "Stake PLUTUS",
        href: "/app/stake",
      },
      {
        label: "Vaults",
        href: "/app/vaults",
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
    ],
  },
  {
    label: "Trade",
    children: [
      {
        label: "Swap (Sushiswap)",
        href: "https://app.sushi.com/swap?inputCurrency=0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a&outputCurrency=0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
      {
        label: "Liquidity (Sushiswap)",
        href: "https://app.sushi.com/add/0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
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
      }
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
        href: "#",
      },
    ],
  },
];

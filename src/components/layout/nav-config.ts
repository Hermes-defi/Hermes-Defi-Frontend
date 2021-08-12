export interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/app",
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
    ],
  },

  {
    label: "Farms",
    href: "/app/farms",
  },

  {
    label: "Pools",
    href: "/app/pools",
  },

  // {
  //   label: "Charts",
  //   href: "https://quickchart.app/",
  //   isExternal: true,
  // },

  {
    label: "Referrals",
    href: "/app/referrals",
  },
  {
    label: "Pre Sale",
    href: "/app/pre-sale",
    decorate: true,
  },
  {
    label: "More",
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
        href: "https://t.me/hermesfinance",
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
    ],
  },
];

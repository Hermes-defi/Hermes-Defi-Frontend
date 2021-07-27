export interface NavItem {
  label: string;
  isExternal?: boolean;
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
        href: "https://quickswap.exchange/#/swap",
        isExternal: true,
      },
      {
        label: "LP (QuickSwap)",
        href: "https://quickswap.exchange/#/pool",
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

  {
    label: "Charts",
    href: "https://quickchart.app/",
    isExternal: true,
  },

  {
    label: "Referrals",
    href: "/app/referrals",
  },

  {
    label: "Media",
    children: [
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
        label: "Audits",
        href: "https://hermes-defi.gitbook.io/hermes-finance/security/audits",
        isExternal: true,
      },
      {
        label: "Info",
        href: "https://hermes-defi.gitbook.io/hermes-finance/get-it-touch/social-media-and-contact",
        isExternal: true,
      },
    ],
  },
];

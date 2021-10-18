export interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const L2_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/app",
  },
  {
    label: "Products",
    children: [
      {
        label: "Farms (coming soon)",
        href: "/app/farms",
      },
      {
        label: "Pools (coming soon)",
        href: "/app/pools",
      },
      {
        label: "Vaults (coming soon)",
        href: "/app/vaults",
      },
      {
        label: "Bank (coming soon)",
        href: "/app/bank",
      },
      {
        label: "Iris Vaults",
        href: "https://hermesdefi.io/app/vaults",
      },
      {
        label: "Stake pAPOLLO",
        href: "/app/waiting-room",
      },
    ],
  },
  {
    label: "Trade",
    children: [],
  },
  {
    label: "Charts",
    children: [],
  },
  {
    label: "Layers",
    children: [
      {
        label: "Iris",
        href: "https://hermesdefi.io/app",
        isExternal: true,
      },
      {
        label: "Apollo",
        href: "/app",
      },
    ],
  },
  {
    label: "Community",
    children: [
      {
        label: "Docs",
        href: "https://hermes-defi.gitbook.io/apollo/",
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
    ],
  },
  {
    label: "Presale",
    href: "/app/pre-sale",
    decorate: true,
  },
];

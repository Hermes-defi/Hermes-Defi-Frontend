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
        label: "Farms",
        href: "/app/farms",
      },
      {
        label: "Pools",
        href: "/app/pools",
      },
      {
        label: "Vaults",
        href: "/app/vaults",
      },
      {
        label: "Bank",
        href: "/app/bank",
      },
      {
        label: "Balancers",
        href: "/app/balancers",
      },
    ],
  },
  {
    label: "Trade",
    children: [
      {
        label: "Swap (DFYN)",
        href: "https://exchange.dfyn.network/#/swap",
        isExternal: true,
      },
      {
        label: "Add liquidity (DFYN)",
        href: "https://exchange.dfyn.network/#/add/0x577aa684B89578628941D648f1Fbd6dDE338F059/0xD86b5923F3AD7b585eD81B448170ae026c65ae9a",
        isExternal: true,
      },
    ],
  },
  {
    label: "Charts",
    children: [
      {
        label: "DexGuru",
        href: "https://dex.guru/token/0x577aa684b89578628941d648f1fbd6dde338f059-polygon",
        isExternal: true,
      },
    ],
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
];

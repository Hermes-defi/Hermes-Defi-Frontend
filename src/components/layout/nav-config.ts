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
        label: "Bank",
        href: "/app/bank",
      },
    ],
  },
  // TODO: change address
  {
    label: "Trade",
    children: [
      {
        label: "Swap (Viper)",
        href: "https://viper.exchange/#/swap",
        isExternal: true,
      },
      {
        label: "Add PLUTUS Liquidity (Viper)",
        href: "",
      },
      {
        label: "Add IRIS Liquidity (Viper)",
        href: "https://viper.exchange/#/add/ONE/0x85FD5f8dBD0c9Ef1806E6c7d4B787d438621C1dC",
        isExternal: true,
      },
    ],
  },
  //TODO: change address
  {
    label: "Charts",
    children: [
      {
        label: "Viper (PLUTUS)",
        href: "",
      },
      
      {
        label: "Viper (IRIS)",
        href: "https://info.viper.exchange/token/0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
        isExternal: true
      }
    ],
  },
  {
    label: "Layers",
    children: [
      {
        label: "Iris",
        href: "https://www.hermesdefi.io/app",
        isExternal: true
      },
      {
        label: "Plutus",
        href: "/app",
      },
    ],
  },
  {
    label: "Community",
    children: [
      {
        label: "Docs",
        href: "https://hermes-defi.gitbook.io/plutus/",
        isExternal: true,
      },
      {
        label: "Github",
        href: "https://github.com/Hermes-defi",
        isExternal: true,
      },
      {
        label: "Discord",
        href: "https://discord.gg/k6SX8pkK",
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
  {
    label: "IDO",
    href: "/app/pre-sale",
    children: [
      {
        label: "IDO",
        href: "/app/pre-sale"
      },
      {
        label: "Waiting Room",
        href: "/app/waiting-room"
      }
    ]
  }
];

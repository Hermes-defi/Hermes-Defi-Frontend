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
        href: "https://viper.exchange/#/swap?inputCurrency=0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a&outputCurrency=0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
      {
        label: "Liquidity (Viper)",
        href: "https://viper.exchange/#/add/0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a/0xe5dFCd29dFAC218C777389E26F1060E0D0Fe856B",
        isExternal: true,
      },
    ],
  },
  //TODO: change address
  {
    label: "Charts",
    children: [
      {
        label: "DexScreener",
        href: "https://dexscreener.com/harmony/0x86ad6271809f350522085f95f5a67d46ff7ed3ab",
        isExternal: true,
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
    label: "Pre-Sale",
    href: "/app/pre-sale",
    children: [
      {
        label: "Pre-Sale",
        href: "/app/pre-sale"
      },
      {
        label: "Waiting Room",
        href: "/app/waiting-room"
      }
    ]
  }
];

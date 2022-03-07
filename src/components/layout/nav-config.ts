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

      {
        label: "Vaults",
        href: "/app/vaults"
      }
    ],
  },  

  {
    label: "Delegation",
    href: "https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5",
    isExternal: true
  },

  {
    label: "Governance",
    href: "https://snapshot.org/#/hermesdefi.eth",
    isExternal: true,
  },


  {
    label: "Trade",
    children: [
      {
        label: "Swap PLUTUS (Viper)",
        href: "https://viper.exchange/#/swap?inputCurrency=0xEf977d2f931C1978Db5F6747666fa1eACB0d0339&outputCurrency=0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        isExternal: true,
      },
      {
        label: "Swap IRIS (Viper)",
        href: "https://viper.exchange/#/swap?inputCurrency=one&outputCurrency=0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
        isExternal: true,
      },
      {
        label: "Add Liquidity PLUTUS / DAI",
        href: "https://viper.exchange/#/add/0xd32858211FCEFd0bE0dD3FD6D069c3E821e0AEf3/0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
        isExternal: true,
      },
      {
        label: "Add Liquidity IRIS / WONE",
        href: "https://viper.exchange/#/add/0x85FD5f8dBD0c9Ef1806E6c7d4B787d438621C1dC/ONE",
        isExternal: true,
      },
    ],
  },

  {
    label: "Charts",
    children: [
      {
        label: "DEX Screener (PLUTUS)",
        href: "https://dexscreener.com/harmony/0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3",
        isExternal: true
      },

      {
        label: "DEX Screener (IRIS)",
        href: "https://dexscreener.com/harmony/0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc",
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
        label: "PLTS docs",
        href: "https://hermes-defi.gitbook.io/plutus/",
        isExternal: true,
      },
      {
        label: "HRMS docs",
        href: "https://hermes-defi.gitbook.io/the-hermes-protocol/",
        isExternal: true,
      },
      {
        label: "Wiki",
        href: "https://wiki.hermesdefi.io/",
        isExternal: true
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
      {
        label: "Reddit",
        href: "https://www.reddit.com/r/HermesDefi/",
        isExternal: true
      }
    ],
  },
];

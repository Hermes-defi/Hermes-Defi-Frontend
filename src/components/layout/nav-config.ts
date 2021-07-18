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
    href: "/",
  },

  {
    label: "Trade",
    children: [
      {
        label: "Swap (SushiSwap)",
        href: "#",
      },
      {
        label: "Swap (QuickSwap)",
        href: "#",
      },
      {
        label: "Swap (Dfyn)",
        href: "#",
      },
      {
        label: "LP (SushiSwap)",
        href: "#",
      },
      {
        label: "LP (QuickSwap)",
        href: "#",
      },
      {
        label: "Lp (Dfyn)",
        href: "#",
      },
    ],
  },

  {
    label: "Farms",
    href: "/farms",
  },
  {
    label: "Pools",
    href: "/pools",
  },
  {
    label: "Charts",
    children: [
      {
        label: "Quick Chart",
        href: "#",
      },
      {
        label: "Dersino",
        href: "#",
      },
    ],
  },
  {
    label: "Referals",
    href: "/referals",
  },
  {
    label: "Media",
    children: [
      {
        label: "Telegram",
        href: "#",
      },
      {
        label: "Twitter",
        href: "#",
      },
      {
        label: "Discord",
        href: "#",
      },
      {
        label: "Medium",
        href: "#",
      },
    ],
  },
  {
    label: "More",
    children: [
      {
        label: "Docs",
        href: "#",
      },
      {
        label: "Github",
        href: "#",
      },
      {
        label: "Audits",
        href: "#",
      },
      {
        label: "Info",
        href: "#",
      },
    ],
  },
];

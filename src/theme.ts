import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },

  colors: {
    primary: {
      "50": "#EEF5F7",
      "100": "#CFE4E8",
      "200": "#B0D3D9",
      "300": "#91C1CA",
      "400": "#72B0BA",
      "500": "#549EAB",
      "600": "#437F89",
      "700": "#325F67",
      "800": "#213F45",
      "900": "#112022",
    },
    secondary: {
      "50": "#F8F5EC",
      "100": "#EDE4CA",
      "200": "#E1D2A8",
      "300": "#D5C086",
      "400": "#C9AF64",
      "500": "#BD9D42",
      "600": "#977E35",
      "700": "#715E28",
      "800": "#4C3F1A",
      "900": "#261F0D",
    },
    accent: {
      "50": "#F7F3EE",
      "100": "#E8DECE",
      "200": "#DAC8AF",
      "300": "#CCB28F",
      "400": "#BD9D70",
      "500": "#AF8750",
      "600": "#8C6C40",
      "700": "#695130",
      "800": "#463620",
      "900": "#231B10",
    },
  },

  fonts: {
    body: "Nunito, sans-serif",
    heading: "Momcake",
  },

  components: {
    Button: {
      base: {
        rounded: "xl",
      },
      variants: {},
    },
  },
});

export const l2Theme = extendTheme(
  {
    colors: {
      primary: {
        "50": "#FBF9E9",
        "100": "#F5EFC2",
        "200": "#EFE49A",
        "300": "#E8DA73",
        "400": "#E2CF4B",
        "500": "#DBC524",
        "600": "#AF9D1D",
        "700": "#847615",
        "800": "#584F0E",
        "900": "#2C2707",
      },
      secondary: {
        "50": "#FFEAE5",
        "100": "#FFC4B8",
        "200": "#FF9D8A",
        "300": "#FF775C",
        "400": "#FF512E",
        "500": "#FF2B00",
        "600": "#CC2200",
        "700": "#991A00",
        "800": "#661100",
        "900": "#330900",
      },
    },
  },
  theme
);

export default theme;

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },

  colors: {
    primary: {
      "50": "#FFE5EA",
      "100": "#FFB8C3",
      "200": "#FF8A9C",
      "300": "#FF5C76",
      "400": "#FF2E4F",
      "500": "#FF0029",
      "600": "#CC0021",
      "700": "#990019",
      "800": "#660010",
      "900": "#330008",
    },
    secondary: {
      "50": "#FCF3E9",
      "100": "#F6DDC1",
      "200": "#F0C799",
      "300": "#EAB271",
      "400": "#E49C49",
      "500": "#DE8621",
      "600": "#B16B1B",
      "700": "#855014",
      "800": "#59360D",
      "900": "#2C1B07",
    },
    accent: {
      "50": "#FFE5E7",
      "100": "#FFB8BB",
      "200": "#FF8A8F",
      "300": "#FF5C63",
      "400": "#FF2E38",
      "500": "#FF000C",
      "600": "#CC0009",
      "700": "#990007",
      "800": "#660005",
      "900": "#330002",
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

export default theme;

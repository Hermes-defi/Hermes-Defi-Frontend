import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },

  colors: {
    primary: {
      "50": "#F3E5FF",
      "100": "#DDB8FF",
      "200": "#C68AFF",
      "300": "#B05CFF",
      "400": "#9A2EFF",
      "500": "#8400FF",
      "600": "#6A00CC",
      "700": "#4F0099",
      "800": "#350066",
      "900": "#1A0033"
    },
    secondary: {
      "50": "#E5F3FF",
      "100": "#B8DEFF",
      "200": "#8AC9FF",
      "300": "#5CB4FF",
      "400": "#2E9FFF",
      "500": "#008BFF",
      "600": "#006FCC",
      "700": "#005399",
      "800": "#003766",
      "900": "#001C33"
    },
    accent: {
      "50": "#E6E5FF",
      "100": "#B8B8FF",
      "200": "#8A8AFF",
      "300": "#5D5CFF",
      "400": "#2F2EFF",
      "500": "#0200FF",
      "600": "#0100CC",
      "700": "#010099",
      "800": "#010066",
      "900": "#000033"
    },
    primaryL2: {
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
    secondaryL2: {
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
    hermesPrimary: {
      "50": "#FDF6E7",
      "100": "#FBE5BC",
      "200": "#F8D491",
      "300": "#F5C365",
      "400": "#F3B23A",
      "500": "#F0A10F",
      "600": "#C0810C",
      "700": "#906109",
      "800": "#604006",
      "900": "#302003",
    },
    hermesAccent: {
      "50": "#EFEDF7",
      "100": "#D1CDEA",
      "200": "#B4ADDC",
      "300": "#978CCE",
      "400": "#7A6CC1",
      "500": "#5C4CB3",
      "600": "#4A3D8F",
      "700": "#372E6B",
      "800": "#251E48",
      "900": "#120F24",
    },
    yellow_one: "#f6c770",
    yellow_two: "#ecc586",
    light_purple: "#c3bde3",
    
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

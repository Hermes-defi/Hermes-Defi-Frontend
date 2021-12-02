import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";
import { mode, transparentize } from "@chakra-ui/theme-tools";

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
      variants: {
        solid: (props) => {
          const { colorScheme: c } = props;

          if (c === "primary") {
            return {
              bg: mode(`${c}.400`, `${c}.200`)(props),
              color: mode("white", `gray.800`)(props),
              _hover: {
                bg: mode(`${c}.500`, `${c}.300`)(props),
                _disabled: {
                  bg: mode(`${c}.500`, `${c}.200`)(props),
                },
              },
              _active: { bg: mode(`${c}.700`, `${c}.400`)(props) },
            };
          }

          return defaultTheme.components.Button.variants.solid;
        },
        outline: (props) => {
          const { colorScheme: c } = props;

          const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
          const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

          if (c === "primary") {
            return {
              border: "1px solid",
              borderColor: "currentColor",
              color: mode(`${c}.400`, `${c}.200`)(props),
              bg: "transparent",
              _hover: {
                bg: mode(`${c}.50`, darkHoverBg)(props),
              },
              _active: {
                bg: mode(`${c}.100`, darkActiveBg)(props),
              },
            };
          }

          return defaultTheme.components.Button.variants.outline;
        },
        action: (props) => ({
          bg: "gray.700",
          color: "white",

          _hover: {
            color: "white",
            bg: "gray.600",

            _disabled: {
              bg: "gray.600",
            },
          },

          _active: {
            bg: "gray.700",
          },
        }),
      },
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

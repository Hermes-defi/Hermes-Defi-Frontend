import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";
import { mode, transparentize } from "@chakra-ui/theme-tools";

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

export default theme;

import { DEFAULT_CHAIN_ID } from "./constants";

export default {
  usdc: {
    decimals: 6,
    address: {
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      80001: "",
    }[DEFAULT_CHAIN_ID],
  },
  iris: {
    decimals: 18,
    address: {
      137: "0xdaB35042e63E93Cc8556c9bAE482E5415B5Ac4B1",
      80001: "",
    }[DEFAULT_CHAIN_ID],
  },
};

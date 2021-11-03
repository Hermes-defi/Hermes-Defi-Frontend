import { DEFAULT_CHAIN_ID } from "./constants";

export default {
  usdc: {
    decimals: 6,
    address: {
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      80001: "",
    }[DEFAULT_CHAIN_ID],
  },
  iron: {
    decimals: 18,
    address: {
      137: "0xD86b5923F3AD7b585eD81B448170ae026c65ae9a",
      80001: "",
    }[DEFAULT_CHAIN_ID],
  },
};

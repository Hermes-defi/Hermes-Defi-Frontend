import { DEFAULT_CHAIN_ID } from "./constants";

export default {
  usdc: {
    decimals: 6,
    address: {
      1666600000: "0x985458E523dB3d53125813eD68c274899e9DfAb4",
      1666700001: "",
    }[DEFAULT_CHAIN_ID],
  },
  iron: {
    decimals: 18,
    address: {
      1666600000: "0xD86b5923F3AD7b585eD81B448170ae026c65ae9a",
      1666700001: "",
    }[DEFAULT_CHAIN_ID],
  },
  wone: {
    decimals: 18,
    address: {
      1666600000: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
      1666700001: "",
    }[DEFAULT_CHAIN_ID]
  },
  dai: {
    decimals: 18,
    address: {
      1666600000: "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
      1666700001: "",
    }[DEFAULT_CHAIN_ID]
  }
};

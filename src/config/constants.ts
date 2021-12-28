

const isProd = process.env.NODE_ENV === "production";

export const DEFAULT_CHAIN_ID = 1666600000; // Harmony Mainnet
export const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export const SECONDS_PER_WEEK = 604_800;
export const SECONDS_PER_YEAR = 31_536_000;

export const BLOCK_TIME = 2.11 // got from https://explorer.harmony.one/
export const BLOCKS_PER_SECOND = (60 / BLOCK_TIME) / 60
export const BLOCKS_PER_DAY = BLOCKS_PER_SECOND * 60 * 60 * 24

export const PLUTUS_PER_BLOCK = 0.4;

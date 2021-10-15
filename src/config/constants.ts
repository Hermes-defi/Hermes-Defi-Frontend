const isProd = process.env.NODE_ENV === "production";

export const DEFAULT_CHAIN_ID = isProd ? 137 : 137; //80001;
export const BurnAddress = "0x000000000000000000000000000000000000dead";
export const irisPerBlock = 0.4;
export const apolloPerBlock = 4.1;
export const secondsPerBlock = 2.1;
export const secondsPerWeek = 604800;
export const secondsPerYear = 31536000;
export const blocksPerDay = 28800;

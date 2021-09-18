const isProd = process.env.NODE_ENV === "production";

export const DEFAULT_CHAIN_ID = isProd ? 137 : 137; //80001;
export const BurnAddress = "0x000000000000000000000000000000000000dEaD";
export const irisPerBlock = 0.4;
export const secondsPerBlock = 2.5;

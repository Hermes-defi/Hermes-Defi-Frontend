const isProd = process.env.NODE_ENV === "production";

export const DEFAULT_CHAIN_ID = isProd ? 137 : 137; // 80001;

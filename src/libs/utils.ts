import dayjs from "dayjs";

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function displayNumber(number: number | string, compact?: boolean, fractionDigits?: number) {
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits ? 2 : 0,
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(number as number);

  return value;
}

export function displayTokenCurrency(number: number | string, token: string, compact?: boolean) {
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(number as number);

  return `${value} ${token}`;
}

export function displayCurrency(number: number | string, compact?: boolean) {
  const value = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    // currencyDisplay: "narrowSymbol",
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(number as number);

  return value.replace(/US/, "");
}

export function blockToTimestamp(block: number) {
  return dayjs().set("s", block * 2.5);
}

import dayjs from "dayjs";
import { abbreviateNumber } from "js-abbreviation-number";

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function displayNumber(number: number | string, compact?: boolean) {
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
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
    currencyDisplay: "narrowSymbol",
    ...(compact ? { notation: "compact", compactDisplay: "short" } : {}),
  }).format(number as number);

  return value;
}

export function blockToTimestamp(block: number) {
  return dayjs().set("s", block * 2.5);
}

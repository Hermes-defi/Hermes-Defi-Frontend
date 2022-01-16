import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function displayNumber(number: number | string, compact?: boolean, fractionDigits?: number) {
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits ? fractionDigits : 0,
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

export function displayTokenCurrencyDecimals(number: number | string, token: string, compact?: boolean, fractionDigits?: number) {
  const value = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: fractionDigits ? fractionDigits : 2,
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

export function blockDiff(block: number) {
  return blockToTimestamp(block).diff(dayjs());
}

export function generateTimeDuration(diff: number) {
  if (diff < 0) {
    return "-";
  }

  const duration = dayjs.duration(diff);

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let resp = "";
  if (days > 0) {
    resp += days > 1 ? `${days} days, ` : `${days} day, `;
  }

  if (hours > 0) {
    resp += hours > 1 ? `${hours} hours, ` : `${hours} hour, `;
  }

  resp += minutes > 1 ? `${minutes} minutes, ` : `${minutes} minute, `;
  resp += seconds > 1 ? `${seconds} seconds` : `${seconds} second`;
  return resp;
}

export const getUtcSecondsFromDayRange = (daysAgo0: number, daysAgo1: number) => {
  const endDate = dayjs().subtract(daysAgo0, "d").startOf("m").toDate();
  const startDate = dayjs().subtract(daysAgo1, "d").startOf("m").toDate();

  const [start, end] = [startDate, endDate].map(getUTCSeconds);
  return [start, end];
};

export const getUTCSeconds = (date: Date) => Math.floor(Number(date) / 1000);


import dayjs from "dayjs";
import { abbreviateNumber } from "js-abbreviation-number";

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function displayNumber(number: number) {
  return abbreviateNumber(number, 1, { padding: false, symbols: ["", "K", "M", "B", "T"] });
}

export function displayCurrency(number: number | string, isToken?: boolean, abbr?: boolean) {
  if (abbr) {
    return abbreviateNumber(parseFloat(`${number}`), 1, {
      padding: false,
      symbols: ["", "K", "M", "B", "T"],
    });
  }

  const value = new Intl.NumberFormat(
    undefined,
    !isToken && {
      style: "currency",
      currency: "USD",
    }
  ).format(number as number);

  // hack to remove the "US" in front of the number
  return isToken ? value : value.replace(/^US/, "");
}

export function blockToTimestamp(block: number) {
  return dayjs().set("s", block * 2.4);
}

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function displayCurrency(number: number | string, isToken?: boolean): string {
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

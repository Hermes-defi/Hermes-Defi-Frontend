import { utils } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useActiveWeb3React } from "wallet";
import { getTokenBalance } from "web3-functions";
import { useERC20 } from "./contracts";

export function useTokenBalance(tokenAddress: string, tokenDecimals = 18) {
  const { account } = useActiveWeb3React();
  const getERC20Contract = useERC20();

  const balance = useQuery(["tokenBalance", account, tokenAddress], async () => {
    if (!account) return null;
    const tokenContract = getERC20Contract(tokenAddress);
    return getTokenBalance(tokenContract, account, tokenDecimals);
  });

  return balance.data;
}

export function useBalance() {
  const { account, library } = useActiveWeb3React();

  const balance = useQuery(["tokenBalance", account], async () => {
    if (!account) return null;
    return library.getBalance(account);
  });

  return balance.data ? utils.formatEther(balance.data) : null;
}

export function useCurrentBlockNumber() {
  const { library } = useActiveWeb3React();
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    (async () => {
      const blockNumber = await library.getBlockNumber();
      setBlockNumber(blockNumber);
    })();
  }, [library]);

  return blockNumber;
}

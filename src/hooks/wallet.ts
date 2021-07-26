import { utils } from "ethers";
import { useEffect, useState } from "react";
import { useActiveWeb3React } from "wallet";
import { getTokenBalance } from "web3-functions";
import { useERC20 } from "./contracts";

export function useTokenBalance(tokenAddress: string) {
  const [balance, setBalance] = useState(null);
  const { account } = useActiveWeb3React();
  const getERC20Contract = useERC20();

  useEffect(() => {
    if (!account) return null;

    const tokenContract = getERC20Contract(tokenAddress);
    getTokenBalance(tokenContract, account).then((balance) => setBalance(balance));
  }, [account]);

  return balance;
}

export function useBalance() {
  const { account, library } = useActiveWeb3React();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!account) return null;

    library.getBalance(account).then((balance) => setBalance(utils.formatEther(balance)));
  }, [account]);

  return balance;
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

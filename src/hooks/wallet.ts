import { utils } from "ethers";
import { useQuery } from "react-query";
import { useActiveWeb3React } from "wallet";
import { getTokenBalance } from "web3-functions";
import defaultContracts from "config/contracts";
import { useERC20 } from "./contracts";

export function useTokenBalance(tokenAddress: string, tokenDecimals = 18) {
  const { account, library } = useActiveWeb3React();
  const getERC20Contract = useERC20();

  const balance = useQuery(["tokenBalance", account, tokenAddress], async () => {
    if (!account) return null;

    if (tokenAddress === "native" || tokenAddress.toLowerCase() === "one") {
      const bal = await library.getBalance(account);
      return utils.formatEther(bal);
    }

    const tokenContract = getERC20Contract(tokenAddress);
    return getTokenBalance(tokenContract, account, tokenDecimals);
  });

  return balance.data;
}

export function useTokensBalance(tokens: { address: string; decimals: number }[]) {
  const { account, library } = useActiveWeb3React();
  const getERC20Contract = useERC20();

  const balances = useQuery(["tokenBalance", account, tokens], async () => {
    if (!account) return null;

    const balances = {};
    for (let token of tokens) {
      if (token.address === "native") {
        balances["native"] = library.getBalance(account);
        continue;
      }

      const tokenContract = getERC20Contract(token.address);
      const balance = await getTokenBalance(tokenContract, account, token.decimals || 18);

      balances[token.address] = balance;
    }

    return balances;
  });

  return balances.data || {};
}

export function useBalance() {
  const { account, library } = useActiveWeb3React();

  const balance = useQuery(["tokenBalance", account], async () => {
    if (!account) return null;
    return library.getBalance(account);
  });

  return balance.data ? utils.formatEther(balance.data) : null;
}
export function usePlutusBalance() {
  return useTokenBalance(defaultContracts.plutusToken.address);
}
export function useCurrentBlockNumber() {
  const { library } = useActiveWeb3React();

  const { data } = useQuery(
    ["currentBlock"],
    () => {
      return library.getBlockNumber();
    },
    { staleTime: 0 }
  );

  return data;
}

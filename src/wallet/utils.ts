import { RPC_INFO } from "config/rpc-info";
import { DEFAULT_CHAIN_ID } from "config/constants";

export async function switchNetwork() {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(DEFAULT_CHAIN_ID).toString(16)}` }],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${Number(DEFAULT_CHAIN_ID).toString(16)}`,
            ...RPC_INFO[DEFAULT_CHAIN_ID],
          },
        ],
      });
    }
  }
}

export async function addTokenToWallet(address: string, symbol: string, image?: string) {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    const success = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol,
          decimals: 18,
          image,
        },
      },
    });

    if (success) {
      console.log("token successfully added to wallet!");
    }
  } catch (error) {
    console.error(error);
  }
}

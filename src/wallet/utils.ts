const isProd = process.env.NODE_ENV === "production";

const RPC_INFO = {
  137: {
    chainName: "Matic Network",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mainnet.matic.network",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet.chainstacklabs.com",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
      "https://matic-mainnet-archive-rpc.bwarelabs.com",
    ],
    blockExplorerUrls: [
      "https://polygon-explorer-mumbai.chainstacklabs.com/",
      "https://explorer-mumbai.maticvigil.com/",
      "https://mumbai-explorer.matic.today/",
      "https://backup-mumbai-explorer.matic.today/",
      "https://polygonscan.com/",
    ],
  },

  80001: {
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mumbai.matic.today",
      "https://matic-mumbai.chainstacklabs.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
    ],
    blockExplorerUrls: [
      "https://polygon-explorer-mainnet.chainstacklabs.com/",
      "https://explorer-mainnet.maticvigil.com/",
      "https://explorer.matic.network/",
      "https://backup-explorer.matic.network/",
      "https://polygonscan.com/",
    ],
  },
};

export async function switchNetwork() {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: isProd ? `0x${Number(137).toString(16)}` : `0x${Number(80001).toString(16)}` },
      ],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: isProd ? `0x${Number(137).toString(16)}` : `0x${Number(80001).toString(16)}`,
            ...RPC_INFO[isProd ? 137 : 80001],
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

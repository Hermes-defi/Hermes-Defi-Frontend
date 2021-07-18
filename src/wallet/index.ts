import React, { useState, useEffect } from "react";
import { injected, RPC_URLS } from "./connectors";
import { providers } from "ethers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

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

export async function switchNetwork(ethereum: any) {
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

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = global as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        activate(injected, undefined, true).catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            switchNetwork(ethereum)
              .then(() => {
                activate(injected, undefined, true);
              })
              .catch((error) => {
                console.error("Failed to activate after chain changed", error);
              });
          }

          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected, undefined, true).catch((error) => {
            if (error instanceof UnsupportedChainIdError) {
              switchNetwork(ethereum)
                .then(() => {
                  activate(injected, undefined, true);
                })
                .catch((error) => {
                  console.error("Failed to activate after accounts changed", error);
                });
            }

            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

export function useConnectorSetup() {
  const { connector } = useWeb3React<providers.Web3Provider>();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
}

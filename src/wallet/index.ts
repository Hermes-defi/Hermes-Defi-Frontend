import React, { useState, useEffect } from "react";
import { injected } from "./connectors";
import { providers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

export function useActiveWeb3React(): Web3ReactContextInterface<providers.Web3Provider> {
  const context = useWeb3React<providers.Web3Provider>();
  const contextNetwork = useWeb3React<providers.Web3Provider>("web3-network");
  return context.active ? context : contextNetwork;
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    console.log("[useEagerConnect] trying to activate");
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to eagerly activate", error);
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
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected, undefined, true).catch((error) => {
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

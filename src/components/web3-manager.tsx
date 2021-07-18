import React, { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEagerConnect, useInactiveListener } from "wallet";
import { network } from "wallet/connectors";

export function Web3ReactManager(props: { children?: React.ReactElement }) {
  const { active } = useWeb3React<providers.Web3Provider>();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React<providers.Web3Provider>("web3-network");

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect isn't active or in an error state, activate it
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <Flex m="auto" w="50%" align="center" justify="center" h="100vh">
        <Text fontSize="3xl" align="center">
          Oops! An unknown error occurred. Please refresh the page, or visit from another browser or
          device.
        </Text>
      </Flex>
    );
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <Flex m="auto" w="50%" align="center" justify="center" h="100vh" direction="column">
        <Spinner size="lg" />
        <Text mt={4}>Loading...</Text>
      </Flex>
    ) : null;
  }

  return props.children;
}

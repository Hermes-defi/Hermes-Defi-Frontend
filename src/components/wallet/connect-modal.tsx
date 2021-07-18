import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { providers } from "ethers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected, SUPPORTED_WALLETS } from "wallet/connectors";
import { switchNetwork } from "wallet/utils";

const Option: React.FC<any> = ({ name, description, href, iconURL, ...props }) => {
  if (href) {
    return (
      <Link
        isExternal
        href={props.disabled ? null : href}
        fontSize="md"
        display="inline-flex"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="xl"
        px={6}
        py={4}
        bg="gray.100"
        borderWidth="1px"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.500" }}
        opacity={props.disabled && 0.4}
        cursor={props.disabled && "not-allowed"}
      >
        <Box align="left">
          <Text fontWeight="600">{name}</Text>
          {description && (
            <Text mt={1} fontWeight="500" fontSize="sm">
              {description}
            </Text>
          )}
        </Box>
        <Image src={iconURL} alt={name} boxSize="20px" />
      </Link>
    );
  }

  return (
    <Button
      isFullWidth
      size="lg"
      fontSize="md"
      py={4}
      height="auto"
      borderWidth="1px"
      borderColor="gray.300"
      alignItems="center"
      justifyContent="space-between"
      borderRadius="xl"
      _hover={{ borderColor: "gray.500" }}
      {...props}
    >
      <Box align="left">
        <Text fontWeight="600">{name}</Text>
        {description && (
          <Text mt={1} fontWeight="500" fontSize="sm">
            {description}
          </Text>
        )}
      </Box>

      <Image src={iconURL} alt={name} boxSize="20px" />
    </Button>
  );
};

const PendingView: React.FC<any> = ({ error }) => {
  return (
    <HStack
      fontSize="md"
      borderRadius="xl"
      px={6}
      py={4}
      bg="white"
      borderWidth="1px"
      borderColor={error ? "red.300" : "gray.300"}
    >
      {!error && <Spinner color="primary.500" size="sm" />}
      {error ? (
        <Text color="red.600">Error connecting. Try again.</Text>
      ) : (
        <Text>Initializing...</Text>
      )}
    </HStack>
  );
};

export const ConnectModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
  const { activate } = useWeb3React<providers.Web3Provider>();

  const [pending, setPending] = useState<boolean>();
  const [pendingError, setPendingError] = useState<boolean>();

  const tryActivation = async (connector: any) => {
    if (!connector) return;

    setPending(true);
    setPendingError(false);

    try {
      await activate(connector, undefined, true);

      console.log(`[ConnectModal] Account activated`, connector);
    } catch (error) {
      if (connector === injected && error instanceof UnsupportedChainIdError) {
        switchNetwork()
          .then(() => {
            activate(injected, undefined, true).then(props.onClose);
          })
          .catch((error) => {
            console.warn("[ConnectModal] Error activating account", error);
          });
      } else {
        console.warn("[ConnectModal] Error activating account", error);
        setPendingError(true);
      }
    } finally {
      setPending(false);
    }
  };

  const renderWalletOption = (walletKey: string) => {
    // @ts-ignore
    const isMetamask = global.ethereum && global.ethereum.isMetaMask;
    const wallet = SUPPORTED_WALLETS[walletKey];

    // if (pendingWallet && pendingWallet !== wallet.connector) return null;

    // overwrite injected when needed
    if (wallet.connector === injected) {
      // don't show injected if there's no injected provider
      // @ts-ignore
      if (!(global.web3 || global.ethereum)) {
        if (wallet.name === "MetaMask") {
          return (
            <Option
              key={walletKey}
              href="https://metamask.io/"
              name="Install Metamask"
              description="Easy-to-use browser extension."
              iconURL="/wallets/metamask.png"
            />
          );
        } else {
          return null; // dont want to return install twice
        }
      }

      // don't return metamask if injected provider isn't metamask
      else if (wallet.name === "MetaMask" && !isMetamask) {
        return null;
      }

      // likewise for generic
      else if (wallet.name === "Injected" && isMetamask) {
        return null;
      }
    }

    return (
      <Option
        key={walletKey}
        href={wallet.href}
        onClick={() => tryActivation(wallet.connector)}
        name={wallet.name}
        disabled={pending}
        iconURL={wallet.iconURL}
      />
    );
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Connect to a wallet</ModalHeader>

        <ModalBody pb={6}>
          <Stack spacing={3}>
            {(pending || pendingError) && <PendingView error={pendingError} />}
            {Object.keys(SUPPORTED_WALLETS).map(renderWalletOption)}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

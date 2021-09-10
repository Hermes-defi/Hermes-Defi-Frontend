import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { WalletModal } from "components/wallet/modal";
import { FiUnlock } from "react-icons/fi";

export const UnlockButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        isFullWidth
        onClick={onOpen}
        rightIcon={<FiUnlock />}
        colorScheme="primary"
        {...props}
      >
        Unlock
      </Button>

      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

import React from "react";
import { Button, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { WalletModal } from "./modal";
import { truncateAddress } from "libs/utils";
import { useWeb3React } from "@web3-react/core";

export const Wallet: React.FC<{}> = () => {
  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accountEllipsis = truncateAddress(account || "", 4);

  return (
    <>
      <Button
        display="inline-flex"
        size={useBreakpointValue({ base: "sm", md: "md" })}
        onClick={onOpen}
        variant={account ? "primaryOutline" : "primary"}
      >
        {account ? accountEllipsis : "Connect Wallet"}
      </Button>

      <WalletModal isOpen={isOpen} onClose={onClose} account={account} />
    </>
  );
};

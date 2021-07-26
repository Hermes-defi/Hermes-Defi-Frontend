import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Stack,
  Text,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";
import { useBalance } from "hooks/wallet";
import { displayCurrency } from "libs/utils";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onPurchase: (amount: string) => Promise<void>;
  onClose: () => void;
};
export const BuyMaticModal: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState("");
  const balance = useBalance();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Purchase FENIX</ModalHeader>

        <ModalBody pb={6}>
          <Stack spacing={5}>
            <Stack
              bg="gray.100"
              spacing={4}
              borderWidth="1px"
              borderColor="gray.300"
              px={3}
              py={3}
              rounded="xl"
              direction="row"
              align="center"
            >
              <Box flex="1">
                {balance && (
                  <Text mb={2} fontSize="xs">
                    Balance: {displayCurrency(balance, true)} MATIC
                  </Text>
                )}

                <Input
                  _focus={{ outline: "none" }}
                  pl={0}
                  borderWidth="0px"
                  fontSize="2xl"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  maxLength={79}
                  minLength={1}
                  spellCheck={false}
                  value={amount}
                  type="number"
                  disabled={props.isLoading}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box>
                <Button
                  onClick={() => setAmount(balance)}
                  size="sm"
                  variant="outline"
                  colorScheme="secondary"
                  isDisabled={props.isLoading}
                >
                  Max
                </Button>
              </Box>
            </Stack>

            <Button
              onClick={() => props.onPurchase(amount).then(() => setAmount(""))}
              isLoading={props.isLoading}
              fontSize="md"
              size="lg"
              variant="solid"
              colorScheme="accent"
              isFullWidth
            >
              Purchase
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

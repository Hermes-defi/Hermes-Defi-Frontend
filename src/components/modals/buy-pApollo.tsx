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
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { useBalance, useTokenBalance } from "hooks/wallet";
import { displayTokenCurrency } from "libs/utils";
import defaultContracts from "config/contracts";
import tokens from "config/tokens";
import { usePresaleQuote } from "state/pre-sale";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  version: "v1" | "v2";
  onPurchase: (amount: string) => Promise<string>;
  onClose: () => void;
};
export const BuypApolloModal: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState("");
  const quotes = usePresaleQuote(props.version, amount);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Purchase pAPOLLO</ModalHeader>

        <ModalBody pb={6}>
          <Stack spacing={5}>
            <Stack
              bg={useColorModeValue("gray.100", "gray.800")}
              spacing={4}
              borderWidth="1px"
              borderColor={useColorModeValue("gray.300", "gray.500")}
              px={3}
              py={3}
              rounded="xl"
              direction="row"
              align="center"
            >
              <Box flex="1">
                <Text mb={2} fontSize="xs">
                  Enter pAPOLLO to purchase
                </Text>

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
            </Stack>

            <Stack>
              <div>
                <Text fontSize="xs">PLUTUS amount (20%):</Text>

                <Skeleton isLoaded={!!quotes.data}>
                  <Text fontSize="sm" fontWeight="bold" as="span">
                    {displayTokenCurrency(quotes.data?.amountInPLUTUS, "PLUTUS")}
                  </Text>
                </Skeleton>
              </div>

              <div>
                <Text fontSize="xs">USDC amount (80%):</Text>
                <Skeleton isLoaded={!!quotes.data}>
                  <Text fontSize="sm" fontWeight="bold" as="span">
                    {displayTokenCurrency(quotes.data?.amountInUSDC, "USDC")}
                  </Text>
                </Skeleton>
              </div>
            </Stack>

            <Button
              onClick={() => props.onPurchase(amount).then(() => setAmount(""))}
              disabled={!quotes.data}
              isLoading={props.isLoading}
              fontSize="md"
              size="lg"
              variant="solid"
              colorScheme="secondary"
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

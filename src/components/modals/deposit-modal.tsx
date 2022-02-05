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
} from "@chakra-ui/react";
import { useTokenBalance } from "hooks/wallet";
import { displayTokenCurrency, displayTokenCurrencyDecimals } from "libs/utils";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
  token: string;
  tokenAddress: string;
  tokenDecimals: number;
};

export const DepositModal: React.FC<Props> = (props) => {
  const balance = useTokenBalance(props.tokenAddress, props.tokenDecimals);
  const [amount, setAmount] = useState("");

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Stake {props.token}</ModalHeader>

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
                {balance && (
                  <Text mb={2} fontSize="xs">
                    Balance: {displayTokenCurrencyDecimals(balance, props.token, false, 6)}
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
              onClick={() => {
                props.onDeposit(amount);
                setAmount("");
              }}
              isLoading={props.isLoading}
              fontSize="md"
              size="lg"
              variant="solid"
              colorScheme="accent"
              isFullWidth
            >
              Deposit
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

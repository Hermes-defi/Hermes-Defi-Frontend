import React, { useState } from "react";
import tokens from "config/tokens";
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
import { displayTokenCurrency } from "libs/utils";
import { useApproveSwapUsdc, useSwapUSDCForPlutus, useUsdcApproved } from "hooks/swap";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const BuyPlutusModal: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState("");
  const balance = useTokenBalance(tokens.usdc.address, tokens.usdc.decimals);

  const approved = useUsdcApproved();
  const approveUSDC = useApproveSwapUsdc();
  const buyPlutus = useSwapUSDCForPlutus();

  const isLoading = approveUSDC.isLoading || buyPlutus.isLoading;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Purchase PLUTUS</ModalHeader>

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
                    Balance: {displayTokenCurrency(balance, "USDC")}
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
                  disabled={isLoading}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box>
                <Button
                  onClick={() => setAmount(balance)}
                  size="sm"
                  variant="outline"
                  colorScheme="secondary"
                  isDisabled={isLoading}
                >
                  Max
                </Button>
              </Box>
            </Stack>

            <Stack direction="row">
              <Button
                onClick={() => approveUSDC.mutateAsync()}
                isLoading={approveUSDC.isLoading}
                fontSize="md"
                size="lg"
                variant="solid"
                colorScheme="accent"
                isDisabled={!!approved.data}
                isFullWidth
              >
                Approve
              </Button>

              <Button
                onClick={() =>
                  buyPlutus
                    .mutateAsync(amount)
                    .then(() => setAmount(""))
                    .then(() => props.onClose())
                }
                isLoading={buyPlutus.isLoading}
                fontSize="md"
                size="lg"
                variant="solid"
                colorScheme="accent"
                isDisabled={!approved.data}
                isFullWidth
              >
                Purchase
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

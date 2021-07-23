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
import { PoolInfo } from "web3-functions";
import { useWithdraw } from "hooks/pools";
import { displayCurrency } from "libs/utils";

type Props = { isOpen: boolean; onClose: () => void; pool: PoolInfo };

export const WithdrawModal: React.FC<Props> = ({ pool, ...props }) => {
  const { withdrawing, withdraw } = useWithdraw();
  const [amount, setAmount] = useState("");

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Unstake {pool.token}</ModalHeader>

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
                <Text mb={2} fontSize="xs">
                  Balance: {displayCurrency(pool.lpStaked, true)} {pool.token}
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
                  disabled={withdrawing}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box>
                <Button
                  onClick={() => setAmount(pool.lpStaked)}
                  size="sm"
                  variant="outline"
                  colorScheme="secondary"
                  isDisabled={withdrawing}
                >
                  Max
                </Button>
              </Box>
            </Stack>

            <Button
              onClick={() =>
                withdraw(pool.pid, amount).then(() => {
                  setAmount("");
                  props.onClose();
                })
              }
              isLoading={withdrawing}
              fontSize="md"
              size="lg"
              variant="solid"
              colorScheme="accent"
              isFullWidth
            >
              Unstake
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

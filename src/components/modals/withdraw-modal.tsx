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
import { useWithdraw } from "hooks/pools-actions";
import { displayCurrency } from "libs/utils";
import { PoolInfo } from "config/pools";

type Props = { isOpen: boolean; onClose: () => void; pool: PoolInfo };

export const WithdrawModal: React.FC<Props> = ({ pool, ...props }) => {
  const withdrawMutation = useWithdraw();
  const [amount, setAmount] = useState("");

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Unstake {pool.lpToken}</ModalHeader>

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
                  Balance: {displayCurrency(pool.lpStaked, true)} {pool.lpToken}
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
                  disabled={withdrawMutation.isLoading}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box>
                <Button
                  onClick={() => setAmount(pool.lpStaked)}
                  size="sm"
                  variant="outline"
                  colorScheme="secondary"
                  isDisabled={withdrawMutation.isLoading}
                >
                  Max
                </Button>
              </Box>
            </Stack>

            <Button
              onClick={() =>
                withdrawMutation.mutate(
                  { pid: pool.pid, amount },
                  {
                    onSuccess: () => {
                      setAmount("");
                      props.onClose();
                    },
                  }
                )
              }
              isLoading={withdrawMutation.isLoading}
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

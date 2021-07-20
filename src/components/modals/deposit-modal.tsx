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
import { useActiveWeb3React } from "wallet";
import { PoolInfo } from "web3-functions";
import { useTokenBalance } from "hooks/wallet";
import { useDepositIntoPool } from "hooks/pools";

type Props = { isOpen: boolean; onClose: () => void; pool: PoolInfo };

export const DepositModal: React.FC<Props> = ({ pool, ...props }) => {
  const { depositing, deposit } = useDepositIntoPool();
  const balance = useTokenBalance(pool.lpAddress);
  const [amount, setAmount] = useState("");

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Deposit {pool.token}</ModalHeader>

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
                    Balance: {balance} {pool.token}
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
                  disabled={depositing}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>

              <Box>
                <Button
                  onClick={() => setAmount(balance)}
                  size="sm"
                  variant="outline"
                  colorScheme="secondary"
                  isDisabled={depositing}
                >
                  Max
                </Button>
              </Box>
            </Stack>

            <Button
              onClick={() =>
                deposit(pool.pid, amount).then(() => {
                  setAmount("");
                  props.onClose();
                })
              }
              isLoading={depositing}
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

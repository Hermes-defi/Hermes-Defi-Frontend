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
  Link,
  Box,
  Input,
} from "@chakra-ui/react";
import { PoolInfo } from "hooks/pools";
import { useActiveWeb3React } from "wallet";

type Props = { isOpen: boolean; onClose: () => void; pool: PoolInfo };

export const DepositModal: React.FC<Props> = ({ pool, ...props }) => {
  const { connector } = useActiveWeb3React();
  const [amount, setAmout] = useState("");

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
                <Text mb={2} fontSize="xs">
                  Balance: 0 {pool.token}
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
                  onChange={(e) => setAmout(e.target.value)}
                />
              </Box>

              <Box>
                <Button size="sm" variant="outline" colorScheme="secondary">
                  Max
                </Button>
              </Box>
            </Stack>

            <Button fontSize="md" size="lg" variant="solid" colorScheme="accent" isFullWidth>
              Deposit
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

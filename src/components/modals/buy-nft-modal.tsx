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

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  max: string;
  onPurchase: (amount: string) => Promise<string>;
  onClose: () => void;
};
export const BuyNftModal: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props
      .onPurchase(amount)
      .then(() => setAmount(""))
      .then(props.onClose);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">Purchase NFT</ModalHeader>

        <ModalBody pb={6}>
          <Stack as="form" onSubmit={onSubmit} spacing={5}>
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
                  Total Available: {props.max}
                </Text>

                <Input
                  _focus={{ outline: "none" }}
                  pl={0}
                  borderWidth="0px"
                  fontSize="2xl"
                  min="0"
                  step="1"
                  pattern="\d*"
                  max={props.max}
                  placeholder="0"
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
                  onClick={() => setAmount(props.max)}
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
              isLoading={props.isLoading}
              type="submit"
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

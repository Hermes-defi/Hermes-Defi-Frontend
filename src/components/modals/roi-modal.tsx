import React from "react";
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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const ROIModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => {
  return (
    <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">ROI</ModalHeader>

        <ModalBody px={8} pb={6}>
          <Stack mb={3} justify="space-between" direction="row">
            <Text color="accent.600" flex="1" fontWeight="bold" fontSize="sm">
              Timeframe
            </Text>
            <Text color="accent.600" flex="1" fontWeight="bold" fontSize="sm">
              ROI
            </Text>
            <Text color="accent.600" flex="1" fontWeight="bold" fontSize="sm">
              IRIS per $1000
            </Text>
          </Stack>

          <Stack mb={7} spacing={1}>
            <Stack mb={1} justify="space-between" direction="row">
              <Text flex="1" fontSize="md">
                1d
              </Text>
              <Text flex="1" fontSize="md">
                0.18%
              </Text>
              <Text flex="1" fontSize="md">
                0.12
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="md">
                7d
              </Text>
              <Text flex="1" fontSize="md">
                1.33%
              </Text>
              <Text flex="1" fontSize="md">
                0.87
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="md">
                30d
              </Text>
              <Text flex="1" fontSize="md">
                5.79%
              </Text>
              <Text flex="1" fontSize="md">
                0.87
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="md">
                365d
              </Text>
              <Text flex="1" fontSize="md">
                98.23%
              </Text>
              <Text flex="1" fontSize="md">
                0.87
              </Text>
            </Stack>
          </Stack>

          <Stack mb={7} spacing={0} px={4} as="ul">
            <Text as="li" fontSize="sm" color="gray.600">
              Calculated based on current rates
            </Text>
            <Text as="li" fontSize="sm" color="gray.600">
              Compounding once daily
            </Text>
            <Text as="li" fontSize="sm" color="gray.600">
              Rates are estimates provided for your convenience only, and by no means represent
              guaranteed returns
            </Text>
          </Stack>

          <Stack spacing={2} direction="row" justify="center" align="center">
            <Button rightIcon={<ExternalLinkIcon color="primary.500" />} size="sm" variant="link">
              <Text fontSize="lg" fontWeight="bold" textColor="primary.500">
                Get IRIS
              </Text>
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

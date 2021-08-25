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
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PoolInfo } from "config/pools";
import { displayNumber, displayTokenCurrency } from "libs/utils";
import { useIrisPrice } from "hooks/prices";

export const APRModal: React.FC<{ isOpen: boolean; onClose: () => void; pool: PoolInfo }> = ({
  pool,
  ...props
}) => {
  const irisPrice = useIrisPrice();

  return (
    <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">ROI</ModalHeader>

        <ModalBody px={8} pb={6}>
          <Stack mb={3} justify="space-between" direction="row">
            <Text
              color={useColorModeValue("accent.600", "accent.200")}
              flex="1"
              fontWeight="bold"
              fontSize="sm"
            >
              Timeframe
            </Text>
            <Text
              color={useColorModeValue("accent.600", "accent.200")}
              flex="1"
              fontWeight="bold"
              fontSize="sm"
            >
              ROI
            </Text>
            <Text
              color={useColorModeValue("accent.600", "accent.200")}
              flex="1"
              fontWeight="bold"
              fontSize="sm"
            >
              IRIS per $1000
            </Text>
          </Stack>

          <Stack mb={7} spacing={1}>
            <Stack mb={1} justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                1d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(pool.apr?.dailyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((pool.apr?.dailyAPR / 100) * 1000) / parseFloat(irisPrice.data),
                  ""
                )}
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                7d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(pool.apr?.weeklyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((pool.apr?.weeklyAPR / 100) * 1000) / parseFloat(irisPrice.data),
                  ""
                )}
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                365d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(pool.apr?.yearlyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((pool.apr?.yearlyAPR / 100) * 1000) / parseFloat(irisPrice.data),
                  ""
                )}
              </Text>
            </Stack>
          </Stack>

          <Stack mb={7} spacing={0} px={4} as="ul">
            <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Calculated based on current rates
            </Text>
            <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Compounding once daily
            </Text>
            <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Rates are estimates provided for your convenience only. No means represent guaranteed
              returns
            </Text>
          </Stack>

          <Stack spacing={2} direction="row" justify="center" align="center">
            <Button
              as={Link}
              href={
                pool.isBalancer
                  ? `https://polygon.balancer.fi/#/pool/${pool.balancerAddress}`
                  : pool.isFarm
                  ? `https://quickswap.exchange/#/add/${pool.pairTokens[0].tokenAddress}/${pool.pairTokens[1].tokenAddress}`
                  : `https://quickswap.exchange/#/swap/${pool.lpAddress}`
              }
              isExternal
              rightIcon={<ExternalLinkIcon color="primary.500" />}
              size="sm"
              variant="link"
            >
              <Text fontSize="lg" fontWeight="bold" textColor="primary.500">
                Get {pool.lpToken}
              </Text>
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

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
import { displayNumber, displayTokenCurrency } from "libs/utils";

export const APRModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  aprs: { dailyAPR?: number; yearlyAPR?: number; weeklyAPR?: number };
  rewardToken: { symbol: string; price: string };
  stakeToken: { symbol: string; link: string };
}> = (props) => {
  return (
    <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalCloseButton />
        <ModalHeader fontSize="md">APR</ModalHeader>

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
              APR
            </Text>
            <Text
              color={useColorModeValue("accent.600", "accent.200")}
              flex="1"
              fontWeight="bold"
              fontSize="sm"
            >
              {props.rewardToken.symbol} per $1000
            </Text>
          </Stack>

          <Stack mb={7} spacing={1}>
            <Stack mb={1} justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                1d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(props.aprs?.dailyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((props.aprs?.dailyAPR / 100) * 1000) / parseFloat(props.rewardToken.price),
                  ""
                )}
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                7d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(props.aprs?.weeklyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((props.aprs?.weeklyAPR / 100) * 1000) / parseFloat(props.rewardToken.price),
                  ""
                )}
              </Text>
            </Stack>

            <Stack justify="space-between" direction="row">
              <Text flex="1" fontSize="sm">
                365d
              </Text>
              <Text flex="1" fontSize="sm">
                {displayNumber(props.aprs?.yearlyAPR)}%
              </Text>
              <Text flex="1" fontSize="sm">
                {displayTokenCurrency(
                  ((props.aprs?.yearlyAPR / 100) * 1000) / parseFloat(props.rewardToken.price),
                  ""
                )}
              </Text>
            </Stack>
          </Stack>

          <Stack mb={7} spacing={0} px={4} as="ul">
            <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Calculated based on current rates
            </Text>
            {/* <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Compounding once daily
            </Text> */}
            <Text as="li" fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
              Rates are estimates provided for your convenience only. No means represent guaranteed
              returns
            </Text>
          </Stack>

          <Stack spacing={2} direction="row" justify="center" align="center">
            {props.stakeToken.symbol !== "pSushi" ? 
              <Button
              as={Link}
              href={props.stakeToken.link}
              isExternal
              rightIcon={<ExternalLinkIcon color="primary.500" />}
              size="sm"
              variant="link"
            >
              <Text fontSize="lg" fontWeight="bold" textColor="primary.500">
                Get {props.stakeToken.symbol}
              </Text>
            </Button>
            :
            <></>
            }
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import React from "react";
import BigNumber from "bignumber.js";
import { Farm } from "config/farms";

import { useActiveWeb3React } from "wallet";
import { useIrisPrice } from "hooks/prices";
import { useApproveFarm, useDepositIntoFarm, useWithdrawFromFarm } from "state/farms";

import {
  Box,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  Link,
  Button,
  useDisclosure,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineCalculator } from "react-icons/ai";

import { UnlockButton } from "./unlock-wallet";
import { WithdrawModal } from "./modals/withdraw-modal";
import { DepositModal } from "./modals/deposit-modal";
import { APRModal } from "./modals/roi-modal";

import { displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";

const DepositButton: React.FC<{ farm: Farm; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const depositMutation = useDepositIntoFarm();

  return (
    <>
      <Button
        size="sm"
        bg={props.primary ? "primary.600" : "gray.700"}
        _hover={{ bg: props.primary ? "primary.500" : "gray.600" }}
        onClick={onOpen}
      >
        {props.children}
      </Button>

      <DepositModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.farm.stakeToken.symbol}
        tokenAddress={props.farm.stakeToken.address}
        tokenDecimals={props.farm.stakeToken.decimals}
        isLoading={depositMutation.isLoading}
        onDeposit={(amount: string) =>
          depositMutation.mutateAsync({ pid: props.farm.pid, amount }).then(() => onClose())
        }
      />
    </>
  );
};

const UnstakeButton: React.FC<{ farm: Farm; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const withdrawMutation = useWithdrawFromFarm();

  return (
    <>
      <Button size="sm" bg={"gray.700"} _hover={{ bg: "gray.600" }} onClick={onOpen}>
        {props.children}
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.farm.stakeToken.symbol}
        tokenBalance={props.farm.userTotalStaked}
        isLoading={withdrawMutation.isLoading}
        onWithdraw={(amount: string) =>
          withdrawMutation.mutateAsync({ pid: props.farm.pid, amount }).then(() => onClose())
        }
      />
    </>
  );
};

const UserSection: React.FC<{ farm: Farm }> = ({ farm }) => {
  const { account } = useActiveWeb3React();
  const approveMutation = useApproveFarm();
  const compoundMutation = useDepositIntoFarm();
  const harvestMutation = useDepositIntoFarm();

  if (!account) {
    return <UnlockButton boxShadow="2xl" />;
  }

  return (
    <Stack spacing={4}>
      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          {farm.userTotalStaked
            ? displayTokenCurrency(farm.userTotalStaked, farm.stakeToken.symbol)
            : `N/A ${farm.stakeToken.symbol}`}{" "}
          Staked
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {farm.userTotalStaked ? displayTokenCurrency(farm.userTotalStaked, "") : "N/A"}
          </Text>

          <Stack direction="row">
            {!farm.hasApprovedPool && (
              <Button
                size="sm"
                isLoading={approveMutation.isLoading}
                onClick={() => approveMutation.mutate(farm.pid)}
                bg="gray.700"
                boxShadow="lg"
                _hover={{ bg: "gray.600" }}
              >
                Approve
              </Button>
            )}

            {farm.hasApprovedPool &&
              (Number(farm.userTotalStaked) > 0 ? (
                <>
                  <UnstakeButton farm={farm}>-</UnstakeButton>

                  <DepositButton farm={farm} primary>
                    +
                  </DepositButton>
                </>
              ) : (
                <DepositButton farm={farm}>Stake</DepositButton>
              ))}
          </Stack>
        </Stack>
      </Box>

      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          Iris Earned
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {farm.rewardsEarned ? displayTokenCurrency(farm.rewardsEarned, "") : "N/A"}
          </Text>

          {farm.hasApprovedPool && (
            <Stack direction="row">
              <Button
                isLoading={harvestMutation.isLoading}
                onClick={() => harvestMutation.mutate({ pid: farm.pid, amount: "0" })}
                size="xs"
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
              >
                Harvest
              </Button>

              {farm.stakeToken.symbol.toLowerCase() === "iris" && (
                <Button
                  isLoading={compoundMutation.isLoading}
                  onClick={() =>
                    compoundMutation.mutate({ pid: farm.pid, amount: farm.rewardsEarned })
                  }
                  size="xs"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                >
                  Compound
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

function APRCalculator({ farm }: { farm: Farm }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: irisPrice } = useIrisPrice();

  return (
    <>
      <Icon onClick={onOpen} mr={1} as={AiOutlineCalculator} />
      <APRModal
        isOpen={isOpen}
        onClose={onClose}
        aprs={farm.apr}
        stakeToken={{
          symbol: farm.stakeToken.symbol,
          link: `https://quickswap.exchange/#/add/${farm.pairs[0].tokenAddress}/${farm.pairs[1].tokenAddress}`,
        }}
        rewardToken={{
          symbol: "IRIS",
          price: irisPrice,
        }}
      />
    </>
  );
}

export const FarmCard: React.FC<{ farm: Farm }> = ({ farm }) => {
  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={
        farm.isSpecial
          ? `linear(to-b, primary.300, accent.500)`
          : `linear(to-t, accent.300, accent.500)`
      }
      rounded="3xl"
      color="white"
    >
      {/* farm name */}
      <HStack align="center" mb={5} spacing={2}>
        <Box w={12} h={12} pos="relative">
          <Image
            pos="absolute"
            top="5px"
            left="0"
            rounded="12px"
            src={farm.stakeToken.logo[0]}
            boxSize={6}
          />
          <Image
            pos="absolute"
            bottom="-5px"
            right="0px"
            rounded="20px"
            src={farm.stakeToken.logo[1]}
            boxSize={10}
          />
        </Box>

        <Heading fontSize="3xl">{farm.stakeToken.symbol}</Heading>
      </HStack>

      <HStack mb={6} spacing={2}>
        {farm.multiplier && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {farm.multiplier}x
          </Badge>
        )}

        {!farm.depositFees && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="green">
            No Fees
          </Badge>
        )}
        {farm.farmDx && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {farm.farmDx}
          </Badge>
        )}
      </HStack>

      <Stack mb={6}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APR
          </Text>
          <Box display="flex" alignItems="center">
            {farm.apr && <APRCalculator farm={farm} />}
            <Text fontWeight="700" fontSize="sm">
              {farm.apr ? `${displayNumber(Math.round(farm.apr.yearlyAPR))}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Earn
          </Text>
          <Text fontWeight="700" fontSize="sm">
            IRIS
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Deposit Fee
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {farm.depositFees}%
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection farm={farm} />
      </Stack>

      {/* pool extra details */}
      <Box align="left">
        <Heading mb={3} fontSize="xl">
          Details
        </Heading>

        <Stack mb={5}>
          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              LP Token Price
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {displayCurrency(farm.stakeToken.price || 0)}
            </Text>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Deposit
            </Text>
            <Link
              href={`https://quickswap.exchange/#/add/${farm.pairs[0].tokenAddress}/${farm.pairs[1].tokenAddress}`}
              isExternal
              fontWeight="700"
              fontSize="sm"
            >
              {farm.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {farm.totalStaked
                ? displayCurrency(
                    new BigNumber(farm.totalStaked).times(farm.stakeToken.price || 0).toNumber()
                  )
                : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/token/${farm.stakeToken.address}`}
          textDecoration="underline"
          fontWeight="700"
          fontSize="sm"
        >
          View on Matic
        </Link>
      </Box>
    </Box>
  );
};

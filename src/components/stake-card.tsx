import React from "react";
import { BigNumber } from "bignumber.js";

import { StakeInfo } from "config/stake";

import {
  useApproveStakePool,
  useDepositIntoStakePool,
  useStakeWithdraw,
} from "hooks/pools/actions";
import { useActiveWeb3React } from "wallet";

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { DepositModal } from "./modals/deposit-modal";
import { WithdrawModal } from "./modals/withdraw-modal";
import { UnlockButton } from "./unlock-wallet";

import { displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";

// Pool Actions
const DepositButton: React.FC<{ pool: StakeInfo; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const depositMutation = useDepositIntoStakePool();

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
        token={props.pool.stakeToken.symbol}
        tokenAddress={props.pool.stakeToken.address}
        tokenDecimals={props.pool.stakeToken.decimal}
        isLoading={depositMutation.isLoading}
        onDeposit={(amount: string) =>
          depositMutation.mutateAsync({ address: props.pool.address, amount }).then(() => onClose())
        }
      />
    </>
  );
};

const UnstakeButton: React.FC<{ pool: StakeInfo; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const withdrawMutation = useStakeWithdraw();

  return (
    <>
      <Button size="sm" bg={"gray.700"} _hover={{ bg: "gray.600" }} onClick={onOpen}>
        {props.children}
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.pool.stakeToken.symbol}
        tokenBalance={props.pool.userTotalStaked}
        isLoading={withdrawMutation.isLoading}
        onWithdraw={(amount: string) =>
          withdrawMutation
            .mutateAsync({ address: props.pool.address, amount })
            .then(() => onClose())
        }
      />
    </>
  );
};

const UserSection: React.FC<{ pool: StakeInfo }> = ({ pool }) => {
  const { account } = useActiveWeb3React();
  const approveMutation = useApproveStakePool();
  const harvestMutation = useDepositIntoStakePool();

  if (!account) {
    return <UnlockButton boxShadow="2xl" />;
  }

  return (
    <Stack spacing={4}>
      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          {pool.userTotalStaked
            ? displayTokenCurrency(pool.userTotalStaked, pool.stakeToken.symbol)
            : `N/A ${pool.stakeToken.symbol}`}{" "}
          Staked
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {pool.userTotalStaked ? displayTokenCurrency(pool.userTotalStaked, "") : "N/A"}
          </Text>

          <Stack direction="row">
            {!pool.hasApprovedPool && (
              <Button
                size="sm"
                isLoading={approveMutation.isLoading}
                onClick={() => approveMutation.mutate(pool.address)}
                bg="gray.700"
                boxShadow="lg"
                _hover={{ bg: "gray.600" }}
              >
                Approve
              </Button>
            )}

            {pool.hasApprovedPool &&
              (Number(pool.userTotalStaked) > 0 ? (
                <>
                  <UnstakeButton pool={pool}>-</UnstakeButton>

                  <DepositButton pool={pool} primary>
                    +
                  </DepositButton>
                </>
              ) : (
                <DepositButton pool={pool}>Stake</DepositButton>
              ))}
          </Stack>
        </Stack>
      </Box>

      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          {pool.rewardToken.symbol} Earned
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {pool.rewardsEarned ? displayTokenCurrency(pool.rewardsEarned, "") : "N/A"}
          </Text>

          {pool.hasApprovedPool && (
            <Stack direction="row">
              <Button
                isLoading={harvestMutation.isLoading}
                onClick={() => harvestMutation.mutate({ address: pool.address, amount: "0" })}
                size="xs"
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
              >
                Harvest
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export const StakePoolCard: React.FC<{ stakePool: StakeInfo }> = ({ stakePool }) => {
  return (
    <Box
      px={8}
      py={4}
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={
        stakePool.isSpecial
          ? `linear(to-b, primary.300, accent.500)`
          : `linear(to-t, accent.300, accent.500)`
      }
      rounded="3xl"
      color="white"
    >
      {/* pool name */}
      <HStack align="center" mb={5} spacing={2}>
        <Image
          border="2px"
          borderColor="white"
          bg="white"
          rounded="24px"
          src={stakePool.rewardToken.logo}
          boxSize={12}
        />

        <Heading fontSize="3xl">
          {stakePool.stakeToken.symbol}/{stakePool.rewardToken.symbol}
        </Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        <Badge boxShadow="md" px={2} rounded="lg" colorScheme="white">
          Stake IRIS
        </Badge>
      </HStack>

      {/* pool details */}
      <Stack mb={6}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APR
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {stakePool.apr
                ? `${displayNumber(Math.round(stakePool.apr.yearlyAPR), true)}%`
                : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Daily ROI
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {stakePool.apr
                ? `${displayNumber(Math.round(stakePool.apr.dailyAPR), true)}%`
                : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Earn
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {stakePool.rewardToken.symbol}
          </Text>
        </Stack>
      </Stack>

      {/* pool user */}
      <Stack mb={8}>
        <UserSection pool={stakePool} />
      </Stack>

      {/* pool extra details */}
      <Box align="left">
        <Heading mb={3} fontSize="xl">
          Details
        </Heading>

        <Stack mb={5}>
          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Deposit
            </Text>
            <Link
              href={`https://quickswap.exchange/#/swap/${stakePool.stakeToken.address}`}
              isExternal
              fontWeight="700"
              fontSize="sm"
            >
              {stakePool.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {stakePool.totalStaked
                ? displayCurrency(
                    new BigNumber(stakePool.totalStaked)
                      .times(stakePool.stakeToken.price || 0)
                      .toNumber()
                  )
                : "N/A"}
            </Text>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Reward End Block
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {stakePool.rewardEndBlock}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/address/${stakePool.address}`}
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

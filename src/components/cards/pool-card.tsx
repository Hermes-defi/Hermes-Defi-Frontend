import React from "react";
import BigNumber from "bignumber.js";

import { displayCurrency, displayNumber } from "libs/utils";

import { useApprovePool, useDepositIntoPool, useWithdrawFromPool } from "state/pools";

import { Pool } from "config/pools";

import { Box, HStack, Heading, Badge, Stack, Image, Link, Text } from "@chakra-ui/react";
import { IrisAPRCalculator } from "components/helpers/apr-calculator";
import { UserSection } from "components/helpers/user-section";

export const PoolCard: React.FC<{ pool: Pool }> = ({ pool }) => {
  const approveMutation = useApprovePool();
  const depositMutation = useDepositIntoPool();
  const harvestMutation = useDepositIntoPool();
  const compoundMutation = useDepositIntoPool();
  const withdrawMutation = useWithdrawFromPool();

  return (
    <Box
      px={7}
      py={5}
      w="20rem"
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={pool.isSpecial ? `linear(to-b, primary.200, accent.400)` : `linear(to-b, secondary.200, accent.400)`}
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
          objectFit="contain"
          src={pool.stakeToken.logo}
          boxSize={12}
        />

        <Heading fontSize="3xl">{pool.stakeToken.symbol}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        {pool.multiplier && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {pool.multiplier}x
          </Badge>
        )}

        {!pool.depositFees && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="green">
            No Fees
          </Badge>
        )}
      </HStack>

      {/* pool details */}
      <Stack mb={6}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APR
          </Text>
          <Box display="flex" alignItems="center">
            {pool.apr && (
              <IrisAPRCalculator
                apr={pool.apr}
                tokenSymbol={pool.stakeToken.symbol}
                tokenLink={`https://quickswap.exchange/#/swap/${pool.stakeToken.address}`}
              />
            )}
            <Text fontWeight="700" fontSize="sm">
              {pool.apr ? `${displayNumber(Math.round(pool.apr.yearlyAPR))}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Earn
          </Text>
          <Text fontWeight="700" fontSize="sm">
            APOLLO
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Deposit Fee
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {pool.depositFees}%
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection
          id={pool.pid}
          canCompound={pool.stakeToken.symbol.toLowerCase() === "apollo"}
          stakeToken={pool.stakeToken}
          rewardToken={{ symbol: "APOLLO" }}
          rewardsEarned={pool.rewardsEarned}
          hasApprovedPool={pool.hasApprovedPool}
          userTotalStaked={pool.userTotalStaked}
          approve={approveMutation}
          deposit={depositMutation}
          withdraw={withdrawMutation}
          harvest={harvestMutation}
          compound={compoundMutation}
        />
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
              href={`https://quickswap.exchange/#/swap/${pool.stakeToken.address}`}
              isExternal
              fontWeight="700"
              fontSize="sm"
            >
              {pool.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {pool.totalStaked
                ? displayCurrency(new BigNumber(pool.totalStaked).times(pool.stakeToken.price || 0).toNumber())
                : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/token/${pool.stakeToken.address}`}
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

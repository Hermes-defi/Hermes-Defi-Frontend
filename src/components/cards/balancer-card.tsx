import React from "react";
import BigNumber from "bignumber.js";

import { displayCurrency, displayNumber } from "libs/utils";

import {
  useApproveBalancer,
  useDepositIntoBalancer,
  useWithdrawFromBalancer,
} from "state/balancers";

import { Balancer } from "config/balancers";

import { Box, HStack, Heading, Badge, Stack, Image, Link, Text } from "@chakra-ui/react";
import { IrisAPRCalculator } from "components/helpers/apr-calculator";
import { UserSection } from "components/helpers/user-section";

export const BalancerCard: React.FC<{ balancer: Balancer }> = ({ balancer }) => {
  const approveMutation = useApproveBalancer();
  const depositMutation = useDepositIntoBalancer();
  const harvestMutation = useDepositIntoBalancer();
  const compoundMutation = useDepositIntoBalancer();
  const withdrawMutation = useWithdrawFromBalancer();

  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={
        balancer.isSpecial
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
          src={balancer.stakeToken.logo}
          boxSize={12}
        />

        <Heading fontSize="3xl">{balancer.stakeToken.symbol}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        {balancer.multiplier && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {balancer.multiplier}x
          </Badge>
        )}

        {!balancer.depositFees && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="green">
            No Fees
          </Badge>
        )}

        {balancer.farmDx && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {balancer.farmDx}
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
            {balancer.apr && (
              <IrisAPRCalculator
                apr={balancer.apr}
                tokenSymbol={balancer.stakeToken.symbol}
                tokenLink={`https://polygon.balancer.fi/#/pool/${balancer.balancerAddress}`}
              />
            )}
            <Text fontWeight="700" fontSize="sm">
              {balancer.apr ? `${displayNumber(Math.round(balancer.apr.yearlyAPR))}%` : "N/A"}
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
            {balancer.depositFees}%
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection
          id={balancer.pid}
          canCompound={balancer.stakeToken.symbol.toLowerCase() === "iris"}
          stakeToken={balancer.stakeToken}
          rewardsEarned={balancer.rewardsEarned}
          hasApprovedPool={balancer.hasApprovedPool}
          userTotalStaked={balancer.userTotalStaked}
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
              href={`https://polygon.balancer.fi/#/pool/${balancer.balancerAddress}`}
              isExternal
              fontWeight="700"
              fontSize="sm"
            >
              {balancer.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {balancer.totalStaked
                ? displayCurrency(
                    new BigNumber(balancer.totalStaked)
                      .times(balancer.stakeToken.price || 0)
                      .toNumber()
                  )
                : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/token/${balancer.stakeToken.price}`}
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

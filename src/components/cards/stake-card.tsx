import React from "react";
import { BigNumber } from "bignumber.js";

import { StakeInfo } from "config/stake";

import { useApproveStakePool, useDepositIntoStakePool, useStakeWithdraw } from "state/stake";

import { Badge, Box, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { UserSection } from "components/helpers/user-section";

import { displayCurrency, displayNumber } from "libs/utils";

export const StakePoolCard: React.FC<{ stakePool: StakeInfo; isVaultToken?: boolean }> = ({
  stakePool,
  isVaultToken,
}) => {
  const approveMutation = useApproveStakePool();
  const harvestMutation = useDepositIntoStakePool();
  const depositMutation = useDepositIntoStakePool();
  const withdrawMutation = useStakeWithdraw();

  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={(() => {
        if (stakePool.isSpecial) return "linear(to-b, primary.300, accent.500)";
        if (isVaultToken) return "linear(to-b, primary.500, pink.300)";

        return "linear(to-t, accent.300, accent.500)";
      })()}
      rounded="3xl"
      color="white"
    >
      {/* pool name */}
      <HStack align="center" mb={5} spacing={2}>
        {stakePool.stakeToken.logo.length == 2 ? (
          <Box w={12} h={12} pos="relative">
            <Image
              pos="absolute"
              top="5px"
              left="0"
              rounded="12px"
              src={stakePool.stakeToken.logo[0]}
              boxSize={6}
            />
            <Image
              pos="absolute"
              bottom="-5px"
              right="0px"
              rounded="20px"
              src={stakePool.stakeToken.logo[1]}
              boxSize={10}
            />
          </Box>
          ) : (
          <Image
            border="2px"
            borderColor="white"
            bg="white"
            rounded="24px"
            src={stakePool.rewardToken.logo}
            boxSize={12}
          />
          )
        }
        <Heading fontSize="3xl">{stakePool.rewardToken.symbol}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        {isVaultToken ? (
          <Badge textTransform="capitalize" boxShadow="md" px={2} rounded="lg" colorScheme="white">
            Stake god
          </Badge>
        ) : (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="white">
            Stake {stakePool.stakeToken.symbol}
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
            <Text fontWeight="700" fontSize="sm">
              {stakePool.apr ? `${displayNumber(stakePool.apr.yearlyAPR, true, 2)}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Daily ROI
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {stakePool.apr ? `${displayNumber(stakePool.apr.dailyAPR, true, 2)}%` : "N/A"}
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
        <UserSection
          id={stakePool.address}
          canCompound={false}
          stakeToken={stakePool.stakeToken}
          rewardToken={stakePool.rewardToken}
          rewardsEarned={stakePool.rewardsEarned}
          hasApprovedPool={stakePool.hasApprovedPool}
          userTotalStaked={stakePool.userTotalStaked}
          approve={approveMutation}
          deposit={depositMutation}
          withdraw={withdrawMutation}
          harvest={harvestMutation}
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
              href={`https://viperswap.one/#/swap?outputCurrency=${stakePool?.stakeToken?.address}`}
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

        <Stack direction="row" justify="space-between">
          <Link
            href={`https://explorer.harmony.one/address/${stakePool.address}`}
            textDecoration="underline"
            fontWeight="700"
            fontSize="sm"
          >
            View on Harmony
          </Link>

          <Link href={stakePool.poolSite} textDecoration="underline" fontWeight="700" fontSize="sm">
            View Project
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

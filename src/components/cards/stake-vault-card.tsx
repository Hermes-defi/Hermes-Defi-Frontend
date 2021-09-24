import React from "react";
import { BigNumber } from "bignumber.js";

import { VaultStakeInfo } from "config/vault-stake";

import {
  useApproveVaultStakePool,
  useDepositIntoVaultStakePool,
  useVaultStakeWithdraw,
} from "state/stake-vault";

import { Badge, Box, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { UserSection } from "components/helpers/user-section";

import { displayNumber } from "libs/utils";

export const VaultStakePoolCard: React.FC<{ stakePool: VaultStakeInfo }> = ({ stakePool }) => {
  const approveMutation = useApproveVaultStakePool();
  const harvestMutation = useDepositIntoVaultStakePool();
  const depositMutation = useDepositIntoVaultStakePool();
  const withdrawMutation = useVaultStakeWithdraw();

  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient="linear(to-b, primary.500, pink.300)"
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

        <Heading fontSize="3xl">{stakePool.rewardToken.symbol}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        <Badge textTransform="capitalize" boxShadow="md" px={2} rounded="lg" colorScheme="white">
          Stake god
        </Badge>
      </HStack>

      {/* pool details */}
      <Stack mb={6}>
        {/* <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APR
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {stakePool.apr ? `${displayNumber(stakePool.apr.yearlyAPR, false, 6)}%` : "N/A"}
            </Text>
          </Box>
        </Stack> */}

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Pool Share
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {stakePool.poolShare ? `${displayNumber(stakePool.poolShare, false, 6)}%` : "N/A"}
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
                ? displayNumber(new BigNumber(stakePool.totalStaked).toNumber())
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
            href={`https://polygonscan.com/address/${stakePool.address}`}
            textDecoration="underline"
            fontWeight="700"
            fontSize="sm"
          >
            View on Matic
          </Link>

          <Link href={stakePool.poolSite} textDecoration="underline" fontWeight="700" fontSize="sm">
            View Project
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

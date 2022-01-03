import React from "react";
import { BigNumber } from "bignumber.js";

import { StakeBankInfo } from "config/stake-bank";

import { useApproveStakePool, useDepositIntoStakePool, useStakeWithdraw } from "state/stake-bank";

import { Badge, Box, Heading, HStack, Image, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { UserSection } from "components/helpers/user-section-bank";

import { displayCurrency, displayNumber } from "libs/utils";

export const BankPoolCard: React.FC<{ stakePool: StakeBankInfo; isVaultToken?: boolean }> = ({
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
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={(() => {
        if (stakePool.isSpecial) return "linear(to-b, pink.300, primary.300)";
        if (isVaultToken) return "linear(to-b, primary.500, pink.300)";

        return "linear(to-t, accent.300, accent.500)";
      })()}
      rounded="3xl"
      color="white"
      w={(() => {
        if(stakePool.isSpecial) return "100%";
        else return "50%"
      }
      )()}
    >
      {/* pool name */}
      <HStack direction={['column', 'row']} align="center" mb={5} spacing={2} justify="space-between">
        <HStack>
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
      <HStack>
      <Box>
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="white" >
            #ROADTOHERMESPROTOCOL
          </Badge>
        </Box>
        <Box>
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="white" >
            Lock {stakePool.stakeToken.symbol}
          </Badge>
        </Box>
        </HStack>
      </HStack>

      {/* pool details */}
      <Stack mb={6}>
        <HStack direction="row" justify="space-between">
        <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
            APR
          </Heading>
          <Box display="flex" alignItems="center">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
              {stakePool.apr ? `${displayNumber(stakePool.apr.yearlyAPR, true, 2)}%` : "N/A"}
            </Heading>
          </Box>
        </HStack>

        <HStack direction="row" justify="space-between">
        <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
            Daily ROI
          </Heading>
          <Box display="flex" alignItems="center">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
              {stakePool.apr ? `${displayNumber(stakePool.apr.dailyAPR, true, 2)}%` : "N/A"}
            </Heading>
          </Box>
        </HStack>

        <HStack direction="row" justify="space-between">
        <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
            Earn
          </Heading>
          <Heading letterSpacing="1px" color="gray.200"fontSize="lg">
            {stakePool.rewardToken.symbol}
          </Heading>
        </HStack>
      </Stack>

      {/* pool user */}
      <Stack mb={8}>
        <UserSection
          address={stakePool.address}
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
        <Stack spacing={[4, 2]} mb={5}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Heading letterSpacing="1px" color="gray.200"fontSize="lg">
              Deposit
            </Heading>
            <Link
              href={`https://quickswap.exchange/#/swap/${stakePool.stakeToken.address}`}
              isExternal
              fontWeight="700"
              fontSize="md"
            >
              {stakePool.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
              $USD Locked
            </Heading>
            <Text fontWeight="bold" fontSize="md">
              {stakePool.totalStaked
                ? displayCurrency(
                    new BigNumber(stakePool.totalStaked)
                      .times(stakePool.stakeToken.price || 0)
                      .toNumber()
                  )
                : "N/A"}
            </Text>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
              Reward End Block
            </Heading>
            <Text fontWeight="700" fontSize="md">
              {stakePool.rewardEndBlock}
            </Text>
          </Stack>
        </Stack>

        <HStack direction="row" justify="space-between">
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
        </HStack>
    </Box>
  );
};

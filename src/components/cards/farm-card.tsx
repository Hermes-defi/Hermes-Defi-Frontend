import React from "react";
import BigNumber from "bignumber.js";
import { Farm } from "config/farms";

import { useApproveFarm, useDepositIntoFarm, useWithdrawFromFarm } from "state/farms";

import { Box, HStack, Heading, Image, Stack, Text, Link, Badge } from "@chakra-ui/react";
import { IrisAPRCalculator } from "components/helpers/apr-calculator";
import { UserSection } from "components/helpers/user-section";

import { displayCurrency, displayNumber } from "libs/utils";

export const FarmCard: React.FC<{ farm: Farm }> = ({ farm }) => {
  const approveMutation = useApproveFarm();
  const depositMutation = useDepositIntoFarm();
  const harvestMutation = useDepositIntoFarm();
  const compoundMutation = useDepositIntoFarm();
  const withdrawMutation = useWithdrawFromFarm();

  const lpLink = {
    quickswap: `https://quickswap.exchange/#/add/${farm.pairs[0].tokenAddress}/${farm.pairs[1].tokenAddress}`,
    dfyn: `https://info.dfyn.network/pair/${farm.stakeToken.address}`,
  };

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
            {farm.apr && (
              <IrisAPRCalculator
                apr={farm.apr}
                tokenSymbol={farm.stakeToken.symbol}
                tokenLink={lpLink[farm.farmDx]}
              />
            )}
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
        <UserSection
          id={farm.pid}
          canCompound={farm.stakeToken.symbol.toLowerCase() === "iris"}
          stakeToken={farm.stakeToken}
          rewardToken={{ symbol: "Iris" }}
          rewardsEarned={farm.rewardsEarned}
          hasApprovedPool={farm.hasApprovedPool}
          userTotalStaked={farm.userTotalStaked}
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
            <Link href={lpLink[farm.farmDx]} isExternal fontWeight="700" fontSize="sm">
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

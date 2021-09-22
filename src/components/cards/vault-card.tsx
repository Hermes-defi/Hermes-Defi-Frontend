import React from "react";
import BigNumber from "bignumber.js";
import { Vault } from "config/vaults";

import { useApproveVault, useDepositIntoVault, useWithdrawFromVault } from "state/vaults";

import { Box, HStack, Heading, Image, Stack, Text, Link, Badge } from "@chakra-ui/react";
import { UserSection } from "components/helpers/user-section";

import { displayCurrency, displayNumber } from "libs/utils";

export const VaultCard: React.FC<{ vault: Vault }> = ({ vault }) => {
  const approveMutation = useApproveVault();
  const depositMutation = useDepositIntoVault();
  const withdrawMutation = useWithdrawFromVault();

  const lpLink = {
    quickswap: `https://quickswap.exchange/#/add/${vault.pairs[0].tokenAddress}/${vault.pairs[1].tokenAddress}`,
    dfyn: `https://info.dfyn.network/pair/${vault.stakeToken.address}`,
  };

  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(84 158 171 / 65%) 0px 25px 50px -12px"
      bgGradient={`linear(to-b, pink.300, primary.500)`}
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
            src={vault.stakeToken.logo[0]}
            boxSize={6}
          />
          <Image
            pos="absolute"
            bottom="-5px"
            right="0px"
            rounded="20px"
            src={vault.stakeToken.logo[1]}
            boxSize={10}
          />
        </Box>

        <Heading fontSize="3xl">{vault.stakeToken.symbol}</Heading>
      </HStack>

      <HStack mb={6} spacing={2}>
        {vault.amm && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {vault.amm}
          </Badge>
        )}
      </HStack>

      <Stack mb={6}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APY
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {vault.apy ? `${displayNumber(vault.apy.yearly, true)}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Daily
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {vault.apy ? `${displayNumber(vault.apy.daily, true, 3)}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Deposit Fees
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {vault.depositFees}%
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Withdrawal Fees
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {vault.withdrawFees}%
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Perfomance Fees
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {vault.performanceFee * 100}%
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection
          id={vault.address}
          disableRewards
          canCompound={false}
          stakeToken={vault.stakeToken}
          unstakeToken={{
            address: vault.address,
            ...vault.rewardToken,
          }}
          rewardToken={{ symbol: vault.rewardToken.symbol }}
          hasApprovedPool={vault.hasApprovedPool}
          userTotalStaked={vault.userTotalStaked}
          userAvailableToUnstake={vault.userAvailableToUnstake}
          approve={approveMutation}
          deposit={depositMutation}
          withdraw={withdrawMutation}
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
              {displayCurrency(vault.stakeToken.price || 0)}
            </Text>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Deposit
            </Text>
            <Link href={lpLink[vault.amm]} isExternal fontWeight="700" fontSize="sm">
              {vault.stakeToken.symbol}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {vault.totalStaked
                ? displayCurrency(
                    new BigNumber(vault.totalStaked).times(vault.stakeToken.price || 0).toNumber()
                  )
                : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/address/${vault.address}`}
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

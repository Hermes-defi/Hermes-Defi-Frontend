import React from "react";
import BigNumber from "bignumber.js";
import { Vault } from "config/vaults";

import { useApproveVault, useDepositIntoVault, useWithdrawAllFromVault, useWithdrawFromVault } from "state/vaults";

import { Box, HStack, Heading, Image, Stack, Text, Link, Badge } from "@chakra-ui/react";
import { UserSection } from "components/helpers/user-section";

import { displayCurrency, displayNumber } from "libs/utils";

export const VaultCard: React.FC<{ vault: Vault }> = ({ vault }) => {
  const approveMutation = useApproveVault();
  const depositMutation = useDepositIntoVault();
  const withdrawMutation = useWithdrawFromVault();
  const withdrawAllMutation = useWithdrawAllFromVault();

  const lpLink = {
    quickswap: `https://quickswap.exchange/#/add/${vault.pairs[0].address}/${vault.pairs[1].address}`,
    dfyn: `https://info.dfyn.network/pair/${vault.stakeToken.address}`,
  };

  return (
    <Box
      px={8}
      py={4}
      w="19rem"
      bg="accent.500"
      boxShadow="rgb(84 158 171 / 65%) 0px 25px 50px -12px"
      bgGradient={`linear(to-b, primary.200, accent.300)`}
      rounded="3xl"
      color="white"
    >
      {/* farm name */}
      <HStack align="center" mb={5} spacing={2}>
        <Box w={12} h={12} pos="relative">
          <Image pos="absolute" top="5px" left="0" rounded="12px" src={vault.stakeToken.logo[0]} boxSize={6} />
          <Image pos="absolute" bottom="-5px" right="0px" rounded="20px" src={vault.stakeToken.logo[1]} boxSize={10} />
        </Box>

        <Heading fontSize="3xl">{vault.stakeToken.symbol}</Heading>
      </HStack>

      <HStack mb={6} spacing={2}>
        {vault.amm && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {vault.amm}
          </Badge>
        )}

        {vault.apy.boostedYearly === vault.apy.yearly && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="green">
            Boosted
          </Badge>
        )}
      </HStack>

      <Stack mb={6}>
        <Stack direction="row" align="center" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APY
          </Text>
          <Stack display="flex" justify="center" spacing={0}>
            {vault.apy?.boostedYearly && (
              <Text fontWeight="700" align="right" fontSize="sm">
                {`${displayNumber(vault.apy.boostedYearly, false, 2)}%`}
              </Text>
            )}
            <Text
              color={vault.apy?.boostedYearly ? "gray.200" : "white"}
              as={vault.apy?.boostedYearly ? "del" : "span"}
              fontWeight="700"
              fontSize="xs"
              align="right"
            >
              {vault.apy ? `${displayNumber(vault.apy.yearly, false, 2)}%` : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Daily
          </Text>
          <Box display="flex" alignItems="center">
            <Text fontWeight="700" fontSize="sm">
              {vault.apy ? `${displayNumber(vault.apy.daily, false, 3)}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        {vault.apy?.dailyWithPool && (
          <Stack direction="row" justify="space-between">
            <Text align="left" fontWeight="600" fontSize="sm">
              Daily{" "}
              <Text as="span" fontSize="xs">
                (vault + godToken)
              </Text>
            </Text>
            <Box display="flex" alignItems="center">
              <Text fontWeight="700" fontSize="sm">
                {`${displayNumber(vault.apy.dailyWithPool, false, 3)}%`}
              </Text>
            </Box>
          </Stack>
        )}

        {vault.apy?.dailyAll && (
          <Stack direction="row" justify="space-between">
            <Text align="left" fontWeight="600" fontSize="sm">
              Daily{" "}
              <Text as="span" fontSize="xs">
                (vault + godToken + bank)
              </Text>
            </Text>
            <Box display="flex" alignItems="center">
              <Text fontWeight="700" fontSize="sm">
                {vault.apy ? `${displayNumber(vault.apy.dailyAll, false, 3)}%` : "N/A"}
              </Text>
            </Box>
          </Stack>
        )}

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

        <Stack direction="row" justify="space-between" alignItems="center">
          <Text align="left" fontWeight="600" fontSize="sm">
            Perfomance Fees
          </Text>
          {/* <Text fontWeight="700" fontSize="sm">
            {vault.performanceFee * 100}%
          </Text> */}
          <Text align="right" fontWeight="700" fontSize="xs">
            Fees redistributed in bank
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection
          id={vault.address}
          disableRewards
          hasWithdrawAll
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
          withdrawAll={withdrawAllMutation}
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
              {displayCurrency(vault.stakeToken.price || 0, true)}
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
                ? displayCurrency(new BigNumber(vault.totalStaked).times(vault.stakeToken.price || 0).toNumber())
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

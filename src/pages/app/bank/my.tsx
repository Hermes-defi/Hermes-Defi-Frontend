import React from "react";
import { AppLayout } from "components/layout";
import { Box, Button, Container, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useCompoundInBank, useDepositedAmount, useHarvestFromBank, useMyBankRewards } from "state/bank";
import { displayCurrency, displayNumber } from "libs/utils";
import { BankNavigation } from ".";

const Page = () => {
  const depositedAmount = useDepositedAmount();
  const rewards = useMyBankRewards();
  const claimMutation = useHarvestFromBank();
  const compoundMutation = useCompoundInBank();

  return (
    <AppLayout>
      <Container maxWidth="container.md" my={8}>
        <Stack spacing={8}>
          <BankNavigation />

          <Stack w="100%" bg="gray.900" color="white" rounded="xl" spacing={6} py={8} px={24}>
            <Heading fontSize="5xl" borderBottom="1px" pb={4} align="center">
              My Pot
            </Heading>

            {/* rewards list */}
            <Stack spacing={3}>
              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Total
                </Text>

                <Skeleton isLoaded={!!rewards.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {displayNumber(rewards.data?.ironRewards || 0, false, 6)} IRON
                  </Text>
                </Skeleton>

                {rewards.data?.poolRewards.map((pool) => (
                  <Text key={pool.name} fontSize="lg" color="primary.400" fontWeight="bold">
                    {displayNumber(pool.reward || 0, false, 3)} {pool.name}
                  </Text>
                ))}
              </Stack>

              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Estimated Dollar Value
                </Text>

                <Skeleton isLoaded={!!rewards.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {displayCurrency(rewards.data?.totalDollarValue)}
                  </Text>
                </Skeleton>
              </Stack>

              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Estimated Amount in APOLLO
                </Text>

                <Skeleton isLoaded={!!rewards.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {displayNumber(rewards.data?.inApollo, false, 4)} APOLLO
                  </Text>
                </Skeleton>
              </Stack>
            </Stack>

            <Stack>
              <Box bg="gray.600" p={4} rounded="xl">
                <Text fontSize="sm">
                  Make sure to have enough APOLLO to receive a lottery ticket since the actual amount of APOLLO you
                  compound will be less than what you see on this page due to slippage (could be up to 10%)
                </Text>
              </Box>
            </Stack>

            <Stack spacing={5}>
              <Text fontSize="xs" align="center">
                COMPOUND WITH 5% BONUS APOLLO, LOTTERY TICKET
              </Text>

              <Button
                isDisabled={!depositedAmount.data}
                isLoading={compoundMutation.isLoading}
                onClick={() => compoundMutation.mutate()}
                colorScheme="primary"
              >
                Compound
              </Button>

              <Button
                isDisabled={!depositedAmount.data}
                isLoading={claimMutation.isLoading}
                onClick={() => claimMutation.mutate()}
                colorScheme="secondary"
              >
                Claim Rewards
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

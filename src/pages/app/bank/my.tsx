import React from "react";
import { AppLayout } from "components/layout";
import { Box, Button, Container, Heading, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
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
      <Container maxWidth="container.lg" my={8}>
        <Stack spacing={8}>
          <BankNavigation />

          <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
              My Earnings
            </Heading>

            <Stack mt={4} direction={["column", "row"]} justify="space-between" spacing={[5, 10]}>
              <Stack flex="1" spacing={4}>
                <Stack spacing={1}>
                  <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" pb={1}>
                    My PLUTUS Burnt
                  </Heading>

                  <Skeleton isLoaded={!!depositedAmount.data}>
                    <Text color="primary.400" fontWeight="bold">
                      {displayNumber(depositedAmount.data || 0, false, 3)} PLUTUS
                    </Text>
                  </Skeleton>
                </Stack>

                <Stack spacing={1}>
                  <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" pb={1}>
                    All my rewards
                  </Heading>

                  <Skeleton isLoaded={!!rewards.data}>
                    <Text color="primary.400" fontWeight="bold">
                      {displayNumber(rewards.data?.ironRewards || 0, false, 6)} IRON
                    </Text>
                  </Skeleton>

                  {rewards.data?.poolRewards.map((pool) => (
                    <Text key={pool.name} color="primary.400" fontWeight="bold">
                      {displayNumber(pool.reward || 0, false, 3)} {pool.name}
                    </Text>
                  ))}
                </Stack>

                <Stack spacing={1}>
                  <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" pb={1}>
                    Estimated Dollar Value
                  </Heading>

                  <Skeleton isLoaded={!!rewards.data}>
                    <Text color="primary.400" fontWeight="bold">
                      {displayCurrency(rewards.data?.totalDollarValue)}
                    </Text>
                  </Skeleton>
                </Stack>

                <Stack spacing={1}>
                  <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg" pb={1}>
                    Estimated Amount in PLUTUS
                  </Heading>

                  <Skeleton isLoaded={!!rewards.data}>
                    <Text fontSize="lg" color="primary.400" fontWeight="bold">
                      {displayNumber(rewards.data?.inPlutus, false, 4)} PLUTUS
                    </Text>
                  </Skeleton>
                </Stack>
              </Stack>

              <Stack flex="1" justify="space-between">
                <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.100")}>
                  Note: Make sure to have enough PLUTUS to receive a lottery ticket since the actual amount of PLUTUS
                  you compound will be less than what you see on this page due to slippage (could be up to 10%)
                </Text>

                <Stack mt={5} spacing={3}>
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
                    bg="secondary.200"
                    color="gray.800"
                    _hover={{ bg: "secondary.400", color: "white" }}
                  >
                    Harvest
                  </Button>

                  <Text fontSize="xs" align="center">
                    compound to get 5% bonus PLUTUS and lottery ticket
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

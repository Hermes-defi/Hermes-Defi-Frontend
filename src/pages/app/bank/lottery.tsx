import React from "react";
import { AppLayout } from "components/layout";
import { Box, Container, Divider, Heading, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useLotteryInfo } from "state/bank";
import { useActiveWeb3React } from "wallet";
import { displayNumber, truncateAddress } from "libs/utils";
import { BankNavigation } from ".";

const Page = () => {
  const { account } = useActiveWeb3React();
  const lotteryInfo = useLotteryInfo();

  return (
    <AppLayout>
      <Container maxWidth="container.md" my={8}>
        <Stack spacing={8}>
          <BankNavigation />

          <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="2xl">
              Lottery
            </Heading>

            <Stack mt={4} spacing={4}>
              <Stack spacing={1}>
                <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                  Price Pot
                </Heading>

                <Skeleton isLoaded={!!lotteryInfo.data}>
                  <Text color="primary.400" fontWeight="bold">
                    {displayNumber(lotteryInfo.data?.pricePot, false, 2)} DAI
                  </Text>
                </Skeleton>
              </Stack>

              <Stack spacing={1}>
                <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                  My Tickets
                </Heading>

                <Skeleton isLoaded={!!lotteryInfo.data}>
                  {lotteryInfo.data?.mytickets.length ? (
                    lotteryInfo.data?.mytickets.map((lot, index) => (
                      <Text key={index} color="primary.400" fontWeight="bold">
                        #{lot} - {truncateAddress(account, 4)}
                      </Text>
                    ))
                  ) : (
                    <Text color="primary.400" fontWeight="bold">
                      -
                    </Text>
                  )}
                </Skeleton>
              </Stack>

              <Stack spacing={1}>
                <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                  Probability
                </Heading>

                <Skeleton isLoaded={!!lotteryInfo.data}>
                  <Text color="primary.400" fontWeight="bold">
                    {lotteryInfo.data?.mytickets?.length}/{lotteryInfo.data?.totalTickets} Tickets <br />
                    {displayNumber(lotteryInfo.data?.probability || 0)}%
                  </Text>
                </Skeleton>
              </Stack>

              <Stack spacing={1}>
                <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                  Lottery Draw in
                </Heading>

                <Skeleton isLoaded={!!lotteryInfo.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {lotteryInfo.data?.timeLeft}
                  </Text>
                </Skeleton>
              </Stack>

              <Stack spacing={1}>
                <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                  Last Winner
                </Heading>

                <Skeleton isLoaded={!!lotteryInfo.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    <Text as="span" fontWeight="semibold">
                      #{lotteryInfo.data?.winnum}
                    </Text>
                    {" - "}
                    {truncateAddress(lotteryInfo.data?.lotWinner || "", 4)}
                  </Text>
                </Skeleton>
              </Stack>

              <Stack align="center">
                <Skeleton isLoaded={!!lotteryInfo.data}>
                  <Text fontSize="sm" letterSpacing="1px">
                    {account === lotteryInfo.data?.lotWinner
                      ? "Yay!! You won the lottery 🎉"
                      : "Sorry better luck next time :("}
                  </Text>
                </Skeleton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import { Button, Container, Divider, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useLotteryInfo } from "state/bank";
import { useActiveWeb3React } from "wallet";
import { displayNumber, truncateAddress } from "libs/utils";

const Page = () => {
  const { account } = useActiveWeb3React();
  const lotterInfo = useLotteryInfo();

  return (
    <AppLayout>
      <Container maxWidth="container.md" my={8}>
        <Stack spacing={8}>
          <Stack direction="row" justify="flex-end">
            <NextLink href="/app/bank" passHref>
              <a>
                <Button colorScheme="accent">Bank</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/my" passHref>
              <a>
                <Button colorScheme="accent">My Pot</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/lottery" passHref>
              <a>
                <Button colorScheme="secondary">Lottery</Button>
              </a>
            </NextLink>
          </Stack>

          <Stack w="100%" bg="gray.900" color="white" rounded="xl" divider={<Divider />} spacing={6} py={8} px={24}>
            <Heading fontSize="5xl" align="center">
              Lottery
            </Heading>

            <Stack spacing={4}>
              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Price Pot
                </Text>

                <Skeleton isLoaded={!!lotterInfo.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {lotterInfo.data?.pricePot} IRON
                  </Text>
                </Skeleton>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  My Tickets
                </Text>

                <Skeleton isLoaded={!!lotterInfo.data}>
                  {lotterInfo.data?.mytickets.length ? (
                    lotterInfo.data?.mytickets.map((lot) => (
                      <Text fontSize="lg" color="primary.400" fontWeight="bold">
                        #{lot} - {truncateAddress(account, 4)}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="lg" color="primary.400" fontWeight="bold">
                      -
                    </Text>
                  )}
                </Skeleton>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Probability
                </Text>

                <Skeleton isLoaded={!!lotterInfo.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    {lotterInfo.data?.mytickets?.length}/{lotterInfo.data?.totalTickets} Tickets <br />
                    {displayNumber(lotterInfo.data?.probability || 0)}%
                  </Text>
                </Skeleton>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Last Winner
                </Text>

                <Skeleton isLoaded={!!lotterInfo.data}>
                  <Text fontSize="lg" color="primary.400" fontWeight="bold">
                    <Text as="span" fontWeight="semibold" color="gray.50">
                      #{lotterInfo.data?.winnum}
                    </Text>{" "}
                    {truncateAddress(lotterInfo.data?.lotWinner || "", 4)}
                  </Text>
                </Skeleton>
              </Stack>
            </Stack>

            <Stack align="center">
              <Skeleton isLoaded={!!lotterInfo.data}>
                <Text fontSize="sm" letterSpacing="1px">
                  {account === lotterInfo.data?.lotWinner
                    ? "Yay!! You won the lottery 🎉"
                    : "Sorry better luck next time :("}
                </Text>
              </Skeleton>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

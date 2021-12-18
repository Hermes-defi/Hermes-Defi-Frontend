import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { useApprovePPlutus, useBuyPPlutus, usePresaleApproveToken, usePresaleInfo, useSwapInfo, useSwapPPlutus } from "state/pre-sale";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuyPlutusModal } from "components/modals/buy-plutus";

import { Box, Button, Container, Heading, HStack, Link, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { BuypPlutusModal } from "components/modals/buy-pPlutus";

const PresaleCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;

  const approveDaiMutation = usePresaleApproveToken();
  const buyPlutus = useBuyPPlutus();

  return (
    <>
      <Stack
        justify="space-between"
        px={8}
        py={8}
        spacing={6}
        boxShadow="lg"
        rounded="3xl"
        bg="secondary.300"
        bgGradient="linear(to-b, secondary.300, secondary.200)"
        color="white"
      >
        <Box>
          <HStack mb={6}>
            <Text fontWeight="700" fontSize="3xl">
              pPLUTUS IDO
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
              pPLUTUS/DAI Ratio
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  1 : 0.116
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pPLUTUS Remaining
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(queryResp.data?.pPlutusRemaining, "pPLUTUS", true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                IDO Starts
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.startBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                IDO Ends
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.endBlock}`}
                </Text>
              </Skeleton>
            </Stack>
          </Stack>
        </Box>

        {/* actions */}
        <Stack mt="auto" mb={8}>
          {!account && (
            <UnlockButton
              isFullWidth
              onClick={onOpen}
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
            />
          )}

          {!queryResp.data?.daiApproved && (
            <Button
              isFullWidth
              onClick={() => approveDaiMutation.mutate("dai")}
              isLoading={approveDaiMutation.isLoading}
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.400" }}
            >
              Approve DAI
            </Button>
          )}

          {queryResp.data?.daiApproved && (
            <Button isFullWidth onClick={onOpen} bg="gray.700" size="lg" fontSize="md" _hover={{ bg: "gray.600" }}>
              Buy pPLUTUS with DAI
            </Button>
          )}
        </Stack>
      </Stack>
      <BuypPlutusModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={buyPlutus.isLoading}
        onPurchase={buyPlutus.mutateAsync}
      />
    </>
  );
};

const SwapCard = () => {
  const { account } = useActiveWeb3React();
  const { onOpen } = useDisclosure();

  const swapInfo = useSwapInfo();
  const approveMutation = useApprovePPlutus();

  const swapPPlutus = useSwapPPlutus();

  return (
    <Stack
      justify="space-between"
      px={8}
      py={8}
      spacing={6}
      boxShadow="lg"
      rounded="3xl"
      bg="secondary.400"
      bgGradient="linear(to-b, secondary.400, secondary.300)"
      color="white"
    >
      <Box>
        <HStack mb={6}>
          <Text fontWeight="700" fontSize="3xl">
            Swap pPLUTUS for PLUTUS
          </Text>
        </HStack>

        {/* pool details */}
        <Stack mb={6} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              pPLUTUS/PLUTUS ratio
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                1 : 1
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              IDO pPLUTUS remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.pPlutusRemaining, "pPLUTUS", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              PLUTUS remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.plutusRemaining, "PLUTUS", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Swap starts at
            </Text>
            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {`Block ${swapInfo.data?.swapStarts}`}
              </Text>
            </Skeleton>
          </Stack>

          {account && (
            <Stack direction={["column", "row"]} justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Your pPLUTUS
              </Text>
              <Skeleton isLoaded={!!swapInfo.data}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(swapInfo.data?.pPlutusBalance, "pPLUTUS", true)}
                </Text>
              </Skeleton>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* actions */}
      <Stack mb={8}>
        {!account ? (
          <UnlockButton
            isFullWidth
            onClick={onOpen}
            bg="gray.700"
            size="lg"
            fontSize="md"
            _hover={{ bg: "gray.600" }}
          />
        ) : (
          <>
            {!swapInfo.data?.pPlutusApproved ? (
              <Button
                isLoading={approveMutation.isLoading}
                onClick={() => approveMutation.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Approve pPLUTUS for Swap
              </Button>
            ) : (
              <Button
                isLoading={swapPPlutus.isLoading}
                onClick={() => swapPPlutus.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Swap all pPLUTUS for PLUTUS
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};


const Page = () => {
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container maxWidth="container.lg">
          <Stack spacing={10} direction={["column-reverse", "row"]} align="flex-start" justify="space-between">
            <Stack flex={1}>
              <PresaleCard />
              <SwapCard/>
            </Stack>

            <Stack flex={1} mb={7} spacing={4}>
              <Heading fontSize="3xl">PLUTUS Timeline</Heading>

              <Stack>
                <Text fontSize="sm">
                  1. IDO starts at block
                </Text>
                

                <Text fontSize="sm">
                  2. IDO ends at block
                </Text>

                {/* <Text fontSize="sm">
                  3. Waiting room. Ongoing (<Link href="app/waiting-room">here</Link>)
                </Text> */}
                <Text fontSize="sm">
                  3. Waiting room begins at block
                </Text>

                <Text fontSize="sm">4. Liquidity added at block</Text>

                <Text fontSize="sm">5. Swap opens (swap pPLUTUS to PLUTUS) at block</Text>

                <Text fontSize="sm">6. Farming starts at block</Text>
              </Stack>

              <Text fontSize="sm">
                For more details visit:{" "}
                <Link
                  isExternal
                  color="blue.600"
                  href="https://hermes-defi.gitbook.io/plutus/launch/time-sequence-and-how-to"
                >
                  https://hermes-defi.gitbook.io/plutus/launch/time-sequence-and-how-to
                </Link>
              </Text>

              <Text fontSize="sm">
                The volatility of the blocks in Harmony is very high. We recommend reviewing them to check the times.
              </Text>

              <Stack>
                <Heading fontSize="xl">How To</Heading>

                <Text fontSize="sm">1. Purchase pPLUTUS with DAI using the IDO Contract</Text>

                <Text fontSize="sm">3. Enjoy the waiting room</Text>

                <Text fontSize="sm">4. Swap pPLUTUS for PLUTUS using the Reedem Contract (Swap Contract)</Text>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

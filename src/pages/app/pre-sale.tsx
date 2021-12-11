import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { usePresaleApproveToken, usePresaleInfo } from "state/pre-sale";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";

import { Box, Button, Container, Heading, HStack, Link, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";

const PresaleCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;

  const approvePlutusMutation = usePresaleApproveToken();
  const approveDaiMutation = usePresaleApproveToken();

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
                  0.116:1
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
              {/* <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.startBlock}`}
                </Text>
              </Skeleton> */}
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                IDO Ends
              </Text>
              {/* <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.endBlock}`}
                </Text>
              </Skeleton> */}
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

          {!queryResp.data?.usdcApproved && (
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
    </>
  );
};

const PlutusCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;

  const approvePlutusMutation = usePresaleApproveToken();
  const approveDaiMutation = usePresaleApproveToken();

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
              pPLUTUS PLUTUS
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pPLUTUS/PLUTUS Ratio
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  1:1
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Your pPlutus
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(1.4)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pPLUTUS Remaining in the contract
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(queryResp.data?.pPlutusRemaining, "pPLUTUS", true)}
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

          {queryResp.data?.plutusApproved && queryResp.data?.usdcApproved && (
            <Button isFullWidth onClick={onOpen} bg="gray.700" size="lg" fontSize="md" _hover={{ bg: "gray.600" }}>
              Buy pPLUTUS with DAI
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

const Page = () => {
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container maxWidth="container.lg">
          <Stack spacing={10} direction={["column-reverse", "row"]} align="flex-start" justify="space-between">
            <Stack flex={1}>
              <PresaleCard />
              <PlutusCard/>
            </Stack>

            <Stack flex={1} mb={7} spacing={4}>
              <Heading fontSize="3xl">PLUTUS Timeline</Heading>

              <Stack>
                <Text fontSize="sm">
                  1. IDO starts
                </Text>

                <Text fontSize="sm">
                  2. IDO ends
                </Text>

                {/* <Text fontSize="sm">
                  3. Waiting room. Ongoing (<Link href="app/waiting-room">here</Link>)
                </Text> */}
                <Text fontSize="sm">
                  3. Waiting room begins
                </Text>

                <Text fontSize="sm">4. Liquidity added at block #20220426</Text>

                <Text fontSize="sm">5. Swap opens (swap pPLUTUS to PLUTUS) at block #20223426</Text>

                <Text fontSize="sm">6. Farming starts at block #20259426</Text>
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

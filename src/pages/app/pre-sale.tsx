import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import {
  useApprovePApollo,
  useBuyPApollo,
  usePresaleApproveToken,
  usePresaleInfo,
  useSwapInfo,
  useSwapPApollo,
} from "state/pre-sale";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuypApolloModal } from "components/modals/buy-pApollo";

import { Box, Button, Container, Heading, HStack, Link, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";

const PresaleCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo("v2");
  const isLoaded = !!queryResp.data;

  const approveIrisMutation = usePresaleApproveToken("v2");
  const approveUsdcMutation = usePresaleApproveToken("v2");

  const buyApollo = useBuyPApollo("v2");

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
        bgGradient="linear(to-b, secondary.400, secondary.300)"
        color="white"
      >
        <Box>
          <HStack mb={6}>
            <Text fontWeight="700" fontSize="3xl">
              pAPOLLO pre-sale #2
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                USDC/IRIS Ratio
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  80:20
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pAPOLLO price
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(1)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pAPOLLO remaining
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(queryResp.data?.pApolloRemaining, "pAPOLLO", true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Presale starts
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.startBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Presale ends
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
              {!queryResp.data?.irisApproved && (
                <Button
                  isFullWidth
                  onClick={() => approveIrisMutation.mutate("iris")}
                  isLoading={approveIrisMutation.isLoading}
                  bg="gray.700"
                  size="lg"
                  fontSize="md"
                  _hover={{ bg: "gray.600" }}
                >
                  Approve IRIS
                </Button>
              )}

              {!queryResp.data?.usdcApproved && (
                <Button
                  isFullWidth
                  onClick={() => approveUsdcMutation.mutate("usdc")}
                  isLoading={approveUsdcMutation.isLoading}
                  bg="gray.700"
                  size="lg"
                  fontSize="md"
                  _hover={{ bg: "gray.400" }}
                >
                  Approve USDC
                </Button>
              )}

              {queryResp.data?.irisApproved && queryResp.data?.usdcApproved && (
                <Button isFullWidth onClick={onOpen} bg="gray.700" size="lg" fontSize="md" _hover={{ bg: "gray.600" }}>
                  Buy pAPOLLO with IRIS/USDC
                </Button>
              )}
            </>
          )}
        </Stack>
      </Stack>

      <BuypApolloModal
        isOpen={isOpen}
        onClose={onClose}
        version={"v2"}
        isLoading={buyApollo.isLoading}
        onPurchase={buyApollo.mutateAsync}
      />
    </>
  );
};

const SwapCard = () => {
  const { account } = useActiveWeb3React();
  const { onOpen } = useDisclosure();

  const swapInfo = useSwapInfo();
  const approveV1Mutation = useApprovePApollo("v1");
  const approveV2Mutation = useApprovePApollo("v2");

  const swapPApolloV1 = useSwapPApollo("v1");
  const swapPApolloV2 = useSwapPApollo("v2");

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
            Swap pAPOLLO for APOLLO
          </Text>
        </HStack>

        {/* pool details */}
        <Stack mb={6} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              pAPOLLO/APOLLO ratio
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                1:1
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Presale V1 pAPOLLO remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.pApolloRemainingV1, "pAPOLLO", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Presale V2 pAPOLLO remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.pApolloRemainingV2, "pAPOLLO", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              V1 APOLLO remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.apolloRemainingV1, "pAPOLLO", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              V2 APOLLO remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.apolloRemainingV2, "pAPOLLO", true)}
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
                Your pAPOLLO
              </Text>
              <Skeleton isLoaded={!!swapInfo.data}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(swapInfo.data?.pApolloBalance, "pAPOLLO", true)}
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
            {!swapInfo.data?.pAPOLLOv1Approved ? (
              <Button
                isLoading={approveV1Mutation.isLoading}
                onClick={() => approveV1Mutation.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Approve V1 pAPOLLO for Swap
              </Button>
            ) : (
              <Button
                isLoading={swapPApolloV1.isLoading}
                onClick={() => swapPApolloV1.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Swap all V1 pAPOLLO for APOLLO
              </Button>
            )}

            {!swapInfo.data?.pAPOLLOv2Approved ? (
              <Button
                isLoading={approveV2Mutation.isLoading}
                onClick={() => approveV2Mutation.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Approve V2 pAPOLLO for Swap
              </Button>
            ) : (
              <Button
                isLoading={swapPApolloV2.isLoading}
                onClick={() => swapPApolloV2.mutate()}
                bg="gray.700"
                size="lg"
                fontSize="md"
                _hover={{ bg: "gray.600" }}
              >
                Swap all V2 pAPOLLO for APOLLO
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

const Page = () => {
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container maxWidth="container.lg">
          <Stack
            spacing={10}
            direction={["column-reverse", "row"]}
            alignItems={["center", "flex-start"]}
            justify="space-between"
          >
            <Stack spacing={5} flex={1}>
              <PresaleCard />

              <SwapCard />
            </Stack>

            <Stack flex={1} mb={7} spacing={4}>
              <Heading fontSize="3xl">Apollo Timeline</Heading>

              <Stack>
                <Text fontSize="sm">
                  <del>1. Presale First round. Done</del>
                </Text>

                <Text fontSize="sm">
                  <del>2. Presale First round ends</del>
                </Text>

                <Text fontSize="sm">
                  3. Waiting room. Ended (<Link href="/app/waiting-room">here</Link>)
                </Text>

                <Text fontSize="sm">4. Presale Second round starts at block #20151640</Text>

                <Text fontSize="sm">5. Presale Second round ends at block #20705323</Text>

                <Text fontSize="sm">6. Liquidity added at block #20708511</Text>

                <Text fontSize="sm">7. Swap opens (swap pAPOLLO to APOLLO) at block #20711511</Text>

                <Text fontSize="sm">8. Farming starts at block #20744511</Text>
              </Stack>

              <Text fontSize="sm">
                For more details visit:{" "}
                <Link
                  isExternal
                  color="blue.600"
                  href="https://hermes-defi.gitbook.io/apollo/launch/time-sequence-and-how-to"
                >
                  https://hermes-defi.gitbook.io/apollo/launch/time-sequence-and-how-to
                </Link>
              </Text>

              <Text fontSize="sm">
                The volatility of the blocks in Polygon is very high. We recommend reviewing them to check the times.
              </Text>

              <Stack>
                <Heading fontSize="xl">How To</Heading>

                <Text fontSize="sm">1. Purchase pAPOLLO with USDC + IRIS using the First Round Pre-sale Contract</Text>

                <Text fontSize="sm">2. Purchase pAPOLLO with USDC + IRIS using the Second Round Pre-sale Contract</Text>

                <Text fontSize="sm">3. Enjoy the waiting room</Text>

                <Text fontSize="sm">4. Swap pAPOLLO for APOLLO using the Reedem Contract (Swap Contract)</Text>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

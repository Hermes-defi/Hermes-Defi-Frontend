import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { useBuyPApollo, usePresaleApproveToken, usePresaleInfo } from "state/pre-sale";

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
        bgGradient="linear(to-b, secondary.300, secondary.200)"
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
                  {displayCurrency(1.4)}
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

const Page = () => {
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container maxWidth="container.lg">
          <Stack spacing={10} direction={["column-reverse", "row"]} align="flex-start" justify="space-between">
            <Stack flex={1}>
              <PresaleCard />
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
                  3. Waiting room. Ongoing (<Link href="/apollo/app/waiting-room">here</Link>)
                </Text>

                <Text fontSize="sm">4. Presale Second round starts at block #20151640</Text>

                <Text fontSize="sm">5. Presale Second round ends at block #20223640</Text>

                <Text fontSize="sm">6. Liquidity added at block #20220426</Text>

                <Text fontSize="sm">7. Swap opens (swap pAPOLLO to APOLLO) at block #20223426</Text>

                <Text fontSize="sm">8. Farming starts at block #20259426</Text>
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

import React from "react";
import ReactGA from "react-ga";

import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  approveFenixContract,
  getPresaleInfo,
  getRedeemInfo,
  purchaseFenix,
  swapFenix,
} from "web3-functions";
import { useFenix, useRedeem, useIrisToken } from "hooks/contracts";
import { blockToTimestamp, displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";
import { useBuyPApollo, usePresaleApproveToken, usePresaleInfo } from "state/pre-sale";

import { ApolloAppLayout } from "components/layout";
import { BuyMaticModal } from "components/modals/buy-matic-modal";
import { SwapFenixModal } from "components/modals/swap-fenix-modal";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuypApolloModal } from "components/modals/buy-pApollo";

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useTimer } from "hooks/timer";
import { l2Theme } from "theme";

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
                Max pAPOLLO available
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(80000, true)}
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
            <Button
              isFullWidth
              onClick={onOpen}
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
            >
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

const RedeemCard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const queryClient = useQueryClient();
  const { account } = useActiveWeb3React();
  const currentBlock = useCurrentBlockNumber();
  const redeemContract = useRedeem();
  const fenixContract = useFenix();
  const irisContract = useIrisToken();

  const redeemInfo = useQuery(["redeem-info", currentBlock], async () => {
    return getRedeemInfo(redeemContract, fenixContract, irisContract, currentBlock, account);
  });

  const approveMutation = useMutation(
    async () => {
      if (!account) throw new Error("No connected account");
      await approveFenixContract(fenixContract);
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("redeem-info");
        queryClient.invalidateQueries("presale-info");

        ReactGA.event({
          category: "Approval",
          action: `Approving FENIX`,
          label: "FENIX",
        });
      },

      onError: ({ data, message }) => {
        console.error(`[approveFenix][error] general error `, {
          data,
        });

        toast({
          title: "Error approving token",
          description: data?.message || message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const swapFenixMutation = useMutation((amount: string) => swapFenix(redeemContract, amount), {
    onSuccess: async (_, amount) => {
      await queryClient.invalidateQueries(["tokenBalance", account, fenixContract.address]);

      ReactGA.event({
        category: "Pre-Sale",
        action: `Swap Fenix for IRIS`,
        value: parseInt(amount, 10),
      });

      onClose();
    },

    onError: ({ data, message }) => {
      toast({
        status: "error",
        position: "top-right",
        title: "Error swapping FENIX",
        description: data?.message || message,
        isClosable: true,
      });
    },
  });

  const redeemTimer = useTimer(blockToTimestamp(redeemInfo.data?.blockToRedeem || 0));

  return (
    <>
      <Stack
        h="100%"
        justify="space-between"
        px={8}
        py={8}
        spacing={6}
        boxShadow="lg"
        rounded="3xl"
        bg="accent.500"
        color="white"
      >
        <Box>
          <HStack mb={6}>
            <Heading>Redeem IRIS</Heading>
          </HStack>

          {/* pool details */}
          <Stack>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Iris Balance
              </Text>
              <Skeleton isLoaded={!!redeemInfo.data}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(redeemInfo.data?.redeemBalance, true)} IRIS
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Rate (FENIX:IRIS)
              </Text>
              <Text fontWeight="700" fontSize="sm">
                1 : 1
              </Text>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Redeem starts
              </Text>
              <Skeleton isLoaded={redeemTimer}>
                <Text fontWeight="700" fontSize="sm">
                  {redeemTimer}
                </Text>
              </Skeleton>
            </Stack>
          </Stack>
        </Box>

        {/* actions */}
        <Stack justifySelf="flex-end">
          {!account ? (
            <UnlockButton />
          ) : !redeemInfo.data?.hasApprovedPool ? (
            <Button
              isFullWidth
              isLoading={approveMutation.isLoading}
              onClick={() => approveMutation.mutate()}
              size="lg"
              fontSize="md"
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
            >
              Approve
            </Button>
          ) : (
            <Button
              isFullWidth
              onClick={onOpen}
              isDisabled={redeemInfo.data?.blockToRedeem > 0}
              size="lg"
              fontSize="md"
              bg="gray.700"
              _hover={{ bg: "gray.600" }}
            >
              Swap FENIX for IRIS
            </Button>
          )}
        </Stack>
      </Stack>

      <SwapFenixModal
        isLoading={swapFenixMutation.isLoading}
        onSwap={swapFenixMutation.mutateAsync}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

const Page = () => {
  return (
    <ApolloAppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container maxWidth="container.lg">
          <Stack
            spacing={10}
            direction={["column-reverse", "row"]}
            align="flex-start"
            justify="space-between"
          >
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
                The volatility of the blocks in Polygon is very high. We recommend reviewing them to
                check the times.
              </Text>

              <Stack>
                <Heading fontSize="xl">How To</Heading>

                <Text fontSize="sm">
                  1. Purchase pAPOLLO with USDC + IRIS using the First Round Pre-sale Contract
                </Text>

                <Text fontSize="sm">
                  2. Purchase pAPOLLO with USDC + IRIS using the Second Round Pre-sale Contract
                </Text>

                <Text fontSize="sm">3. Enjoy the waiting room</Text>

                <Text fontSize="sm">
                  4. Swap pAPOLLO for APOLLO using the Reedem Contract (Swap Contract)
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </ApolloAppLayout>
  );
};

Page.theme = l2Theme;

export default Page;

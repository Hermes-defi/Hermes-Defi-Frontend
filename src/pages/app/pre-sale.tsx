import React from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import defaultContracts from "config/contracts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  approveFenixContract,
  getPresaleInfo,
  getRedeemInfo,
  purchaseFenix,
  swapFenix,
} from "web3-functions";
import { useFenix, useRedeem } from "hooks/contracts";
import { blockToTimestamp, displayCurrency } from "libs/utils";
import { useCurrentBlockNumber, useTokenBalance } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";

import { AppLayout } from "components/layout";
import { BuyMaticModal } from "components/modals/buy-matic-modal";
import { SwapFenixModal } from "components/modals/swap-fenix-modal";
import { UnlockButton } from "components/unlock-wallet";

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

dayjs.extend(relativeTime);

const PresaleCard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const queryClient = useQueryClient();
  const fenixContract = useFenix();
  const currentBlock = useCurrentBlockNumber();
  const { account } = useActiveWeb3React();

  const presaleInfo = useQuery(["presale-info", currentBlock], async () => {
    return getPresaleInfo(fenixContract, currentBlock);
  });

  const purchaseFenixMutation = useMutation(
    (amount: string) => purchaseFenix(fenixContract, amount),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("presale-info");
        await queryClient.invalidateQueries(["tokenBalance", account, fenixContract.address]);
        onClose();
      },

      onError: ({ data, message }) => {
        toast({
          status: "error",
          position: "top-right",
          title: "Error purchasing FENIX",
          description: data?.message || message,
        });
        onClose();
      },
    }
  );

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
          {/* pool name */}
          <HStack mb={6}>
            <Heading>Fenix sale contract</Heading>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Fenix remaining
              </Text>

              <Skeleton isLoaded={!!presaleInfo.data?.fenixRemaining}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(presaleInfo.data?.fenixRemaining, true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Fenix price (in MATIC)
              </Text>

              <Skeleton isLoaded={!!presaleInfo.data?.fenixPrice}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(presaleInfo.data?.fenixPrice, true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Max Fenix available
              </Text>

              <Skeleton isLoaded={!!presaleInfo.data?.maxFenix}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(presaleInfo.data?.maxFenix, true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Max Fenix to be purchased
              </Text>
              <Skeleton isLoaded={!!presaleInfo.data?.maxFenixToPurchase}>
                <Text fontWeight="700" fontSize="sm">
                  {displayCurrency(presaleInfo.data?.maxFenixToPurchase, true)}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Presale starts
              </Text>
              <Skeleton isLoaded={presaleInfo.data?.presaleStartBlock !== undefined}>
                <Text fontWeight="700" fontSize="sm">
                  {blockToTimestamp(presaleInfo.data?.presaleStartBlock || 0).fromNow()}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Presale ends
              </Text>
              <Skeleton isLoaded={presaleInfo.data?.presaleEndBlock !== undefined}>
                <Text fontWeight="700" fontSize="sm">
                  {blockToTimestamp(presaleInfo.data?.presaleEndBlock || 0).fromNow()}
                </Text>
              </Skeleton>
            </Stack>
          </Stack>
        </Box>

        {/* actions */}
        <Stack mt="auto" mb={8}>
          <Button
            isFullWidth
            onClick={onOpen}
            isDisabled={
              presaleInfo.data?.presaleStartBlock > 0 || presaleInfo.data?.presaleEndBlock < 0
            }
            bg="gray.700"
            size="lg"
            fontSize="md"
            _hover={{ bg: "gray.600" }}
          >
            Buy FENIX with MATIC
          </Button>
        </Stack>
      </Stack>

      <BuyMaticModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={purchaseFenixMutation.isLoading}
        onPurchase={purchaseFenixMutation.mutateAsync}
      />
    </>
  );
};

const RedeemCard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const queryClient = useQueryClient();
  const { account } = useActiveWeb3React();
  const fenixBalance = useTokenBalance(defaultContracts.fenixToken.address);
  const currentBlock = useCurrentBlockNumber();
  const redeemContract = useRedeem();
  const fenixContract = useFenix();

  const redeemInfo = useQuery(["redeem-info", currentBlock], async () => {
    return getRedeemInfo(redeemContract, fenixContract, currentBlock, account);
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
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tokenBalance", account, fenixContract.address]);
      onClose();
    },

    onError: ({ data, message }) => {
      toast({
        status: "error",
        position: "top-right",
        title: "Error swapping FENIX",
        description: data?.message || message,
      });
    },
  });

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
                Fenix Balance
              </Text>
              <Text fontWeight="700" fontSize="sm">
                {displayCurrency(fenixBalance, true)}
              </Text>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Rate (FENIX:IRIS)
              </Text>
              <Text fontWeight="700" fontSize="sm">
                1:1
              </Text>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Redeem starts
              </Text>
              <Skeleton isLoaded={redeemInfo.data?.blockToRedeem !== undefined}>
                <Text fontWeight="700" fontSize="sm">
                  {blockToTimestamp(redeemInfo.data?.blockToRedeem || 0).fromNow()}
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

const Page: React.FC = () => {
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={10}>
        <Container align="center" maxWidth="container.lg">
          <SimpleGrid spacing="80px" alignItems="center" columns={[1, 2]}>
            <PresaleCard />
            <RedeemCard />
          </SimpleGrid>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

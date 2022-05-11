import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import {
  useApprovePPlutus,
  useBuyPPlutus,
  usePresaleApproveToken,
  usePresaleInfo,
  useSwapInfo,
  useSwapPPlutus,
} from "state/pre-sale";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuyPlutusModal } from "components/modals/buy-plutus";

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
} from "@chakra-ui/react";
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
        bgGradient="linear(to-b, hermesAccent.400, hermesPrimary.400)"
        color="white"
      >
        <Box>
          <HStack mb={6}>
            <Text fontWeight="700" fontSize="3xl">
              Swap PLTS for pHRMS (Public)
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                PLTS/pHRMS Ratio
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  1 : 0.5604
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pHRMS Remaining
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(
                    queryResp.data?.pPlutusRemaining,
                    "pHRMS",
                    true
                  )}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Starts
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.startBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Ends
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
              Approve PLTS
            </Button>
          )}

          {queryResp.data?.daiApproved && (
            <Button
              isFullWidth
              onClick={onOpen}
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
            >
              Swap PLTS for pHRMS
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
const PresaleBankCard = () => {
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
        bgGradient="linear(to-b, hermesAccent.400, hermesPrimary.400)"
        color="white"
      >
        <Box>
          <HStack mb={6}>
            <Text fontWeight="700" fontSize="3xl">
              Swap PLTS for pHRMS (Bank)
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                PLTS/pHRMS Ratio
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  1 : 0.661
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pHRMS Remaining
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(
                    queryResp.data?.pPlutusRemaining,
                    "pHRMS",
                    true
                  )}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Starts
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.startBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Ends
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
              Approve PLTS
            </Button>
          )}

          {queryResp.data?.daiApproved && (
            <Button
              isFullWidth
              onClick={onOpen}
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
            >
              Swap PLTS for pHRMS
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
      bgGradient="linear(to-b, hermesPrimary.400, hermesAccent.300)"
      color="white"
    >
      <Box>
        <HStack mb={6}>
          <Text fontWeight="700" fontSize="3xl">
            Swap pHRMS for HRMS
          </Text>
        </HStack>

        {/* pool details */}
        <Stack mb={6} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              pHRMS/HRMS ratio
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                1 : 1
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              IDO pHRMS remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(
                  swapInfo.data?.pPlutusRemaining,
                  "pHRMS",
                  true
                )}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              HRMS remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(
                  swapInfo.data?.plutusRemaining,
                  "HRMS",
                  true
                )}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Swap starts at
            </Text>
            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {/* {`Block ${swapInfo.data?.swapStarts}`} */}
                Block 21006024
              </Text>
            </Skeleton>
          </Stack>

          {account && (
            <Stack direction={["column", "row"]} justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Your pHRMS
              </Text>
              <Skeleton isLoaded={!!swapInfo.data}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(
                    swapInfo.data?.pPlutusBalance,
                    "pHRMS",
                    true
                  )}
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
                Approve pHRMS for Swap
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
                Swap all pHRMS for HRMS
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};
const Timeline = () => {
  return (
    <Stack direction={"row"} mt={7} mx={10}>
      <Stack mb={7} spacing={4} flex={1}>
        <Heading fontSize="3xl">HERMES Timeline</Heading>

        <Stack>
          <Text fontSize="sm">1. IDO starts at block 20833224</Text>

          <Text fontSize="sm">2. IDO ends at block 20962824</Text>

          <Text fontSize="sm">3. Waiting room begins at block 20962824</Text>

          <Text fontSize="sm">4. Liquidity added at block 21002424</Text>

          <Text fontSize="sm">
            5. Swap opens (swap pPLUTUS to PLUTUS) at block 21006024
          </Text>

          <Text fontSize="sm">
            6. Waiting room ends and farming starts at block 21048525
          </Text>
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
          The volatility of the blocks in Harmony is very high. We recommend
          reviewing them to check the times.
        </Text>
      </Stack>
      <Stack mb={7} spacing={4} flex={1}>
        <Heading fontSize="3xl">How To</Heading>

        <Text fontSize="sm">
          1. Swap your PLTS for pHRMS using the IDO Contract
        </Text>

        <Text fontSize="sm">
          2. Wait until reedem is open
        </Text>

        <Text fontSize="sm">
          3. Swap your pHRMS for HRMS using the Reedem Contract (Swap Contract)
        </Text>
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
          <Stack
            spacing={10}
            direction={["column-reverse", "row"]}
            align="flex-start"
            justify="space-between"
            mb={10}
          >
            <PresaleCard />
            <PresaleBankCard />
          </Stack>
          <SwapCard />
          <Timeline />
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

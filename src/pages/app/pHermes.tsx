import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import {
  useApprovePHermes,
  useSwapPHermes,
  usePresaleApproveToken,
  usePresaleInfo,
  useSwapInfo,
  useSwapPlutus,
  useSwapBankPlutus,
  usePresaleBankApproveToken,
} from "state/swap-hermes";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuypHermesModal } from "components/modals/buy-pHermes";

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Link,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { usepHermesToken } from "hooks/contracts";
import { useCurrentBlockNumber, useTokenBalance } from "hooks/wallet";

const PresaleCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;
  const approvePLTSMutation = usePresaleApproveToken();
  const swapPlutus = useSwapPlutus();
  const currentBlock = useCurrentBlockNumber();
  const active = currentBlock < 25330605;
  const fontButtonColor = active ? "pink.800" : "gray.700";
  const bgButtonColor = active ? "pink.200" : "gray.400";
  const textColor = !active ? "gray.600" : "white";

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
        bgGradient={
          active
            ? "linear(to-b, accent.100, accent.700)"
            : "linear(to-b, gray.200, gray.500)"
        }
        color={textColor}
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
                    queryResp.data?.generalPHermesRemaining,
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
                  {`Block ${queryResp.data?.generalStartBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Ends
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.generalEndBlock}`}
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
              bg={bgButtonColor}
              color={fontButtonColor}
              size="lg"
              fontSize="md"
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            />
          )}
          {account && !queryResp.data?.generalPltsApproved && (
            <Button
              isFullWidth
              onClick={() => approvePLTSMutation.mutate("plts")}
              isLoading={approvePLTSMutation.isLoading}
              bg={bgButtonColor}
              size="lg"
              fontSize="md"
              color={fontButtonColor}
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            >
              Approve PLTS
            </Button>
          )}
          {account && queryResp.data?.generalPltsApproved && (
            <Button
              isFullWidth
              onClick={onOpen}
              bg={bgButtonColor}
              size="lg"
              fontSize="md"
              color={fontButtonColor}
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            >
              Swap PLTS for pHRMS
            </Button>
          )}
        </Stack>
      </Stack>
      <BuypHermesModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={swapPlutus.isLoading}
        onPurchase={swapPlutus.mutateAsync}
      />
    </>
  );
};
const PresaleBankCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;

  const approvePltsMutation = usePresaleBankApproveToken();
  const swapBankPlutus = useSwapBankPlutus();
  const currentBlock = useCurrentBlockNumber();
  const active = currentBlock < 25330605;
  const fontButtonColor = active ? "pink.800" : "gray.700";
  const bgButtonColor = active ? "pink.200" : "gray.400";
  const textColor = !active ? "gray.600" : "white";

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
        bgGradient={
          active
            ? "linear(to-b, accent.100, accent.700)"
            : "linear(to-b, gray.200, gray.500)"
        }
        color={textColor}
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
                    queryResp.data?.bankPHermesRemaining,
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
                  {`Block ${queryResp.data?.bankStartBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Ends
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.bankEndBlock}`}
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
              bg={bgButtonColor}
              color={fontButtonColor}
              size="lg"
              fontSize="md"
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            />
          ) : !queryResp.data?.bankPltsApproved ? (
            <Button
              isFullWidth
              onClick={() => approvePltsMutation.mutate("plts")}
              isLoading={approvePltsMutation.isLoading}
              bg={bgButtonColor}
              color={fontButtonColor}
              size="lg"
              fontSize="md"
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            >
              Approve PLTS
            </Button>
          ) : (
            <Button
              isFullWidth
              onClick={onOpen}
              bg={bgButtonColor}
              color={fontButtonColor}
              size="lg"
              fontSize="md"
              _hover={{ bg: "pink.300", color: "white" }}
              isDisabled={!active}
            >
              Swap PLTS for pHRMS
            </Button>
          )}
        </Stack>
      </Stack>
      <BuypHermesModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={swapBankPlutus.isLoading}
        onPurchase={swapBankPlutus.mutateAsync}
      />
    </>
  );
};

const SwapCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const swapInfo = useSwapInfo();
  const approveMutation = useApprovePHermes();
  const pHermesContract = usepHermesToken();
  const pHermesBalance = useTokenBalance(pHermesContract.address, 18);
  const swapPHermes = useSwapPHermes();
  const currentBlock = useCurrentBlockNumber();
  const active = currentBlock > 25213250;
  const fontButtonColor = active ? "pink.800" : "gray.700";
  const bgButtonColor = active ? "gray.200" : "gray.400";
  const textColor = !active ? "gray.600" : "white";

  return (
    <Stack
      justify="space-between"
      px={8}
      py={8}
      spacing={6}
      boxShadow="lg"
      rounded="3xl"
      bg="secondary.400"
      bgGradient={
        active
          ? "linear(to-b, hermesPrimary.200, hermesAccent.300)"
          : "linear(to-b, gray.200, gray.500)"
      }
      color={textColor}
      w={"full"}
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
              HRMS remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(
                  swapInfo.data?.hermesRemaining,
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
                {`Block ${swapInfo.data?.swapStarts}`}
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
                    swapInfo.data?.pHermesBalance,
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
            bg={bgButtonColor}
            color={fontButtonColor}
            size="lg"
            fontSize="md"
            _hover={{ bg: "pink.800", color: "white" }}
            isDisabled={!active}
          />
        ) : (
          <>
            {!swapInfo.data?.pHermesApproved ? (
              <Button
                isLoading={approveMutation.isLoading}
                onClick={() => approveMutation.mutate()}
                bg={bgButtonColor}
                color={fontButtonColor}
                size="lg"
                fontSize="md"
                isDisabled={!active}
                _hover={{ bg: "pink.800", color: "white" }}
              >
                Approve pHRMS for Swap
              </Button>
            ) : (
              <Button
                isLoading={swapPHermes.isLoading}
                onClick={() => swapPHermes.mutate(pHermesBalance)}
                bg={bgButtonColor}
                color={fontButtonColor}
                size="lg"
                fontSize="md"
                _hover={{ bg: "pink.800", color: "white" }}
                isDisabled={!active}
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
  const queryResp = usePresaleInfo();
  const swapInfo = useSwapInfo();

  return (
    <Stack direction={"row"} mt={7} mx={10}>
      <Stack mb={7} spacing={4} flex={1}>
        <Heading fontSize="3xl">HERMES Timeline</Heading>

        <Stack>
          <Text fontSize="sm">
            1. PLTS to pHRMS Swap Opens at block {queryResp.data?.startBlock}{" "}
            (~May 15th)
          </Text>

          <Text fontSize="sm">
            2. PLTS Project Owned Liquidity (&gt 90% as of 4/14/22) Swapped at
            block xx,xxx,xxx
          </Text>

          <Text fontSize="sm">
            3. PLTS to pHRMS Swap Closes at block {queryResp.data?.endBlock}{" "}
            (~May 19th)
          </Text>
          <Text fontSize="sm">
            ALL PLTS MUST BE SWAPPED BEFORE PLTS SWAP CLOSES
          </Text>

          <Text fontSize="sm">
            4. HRMS Liquidity Added (DEX Launch!) at block xx,xxx,xxx (~May
            20th)
          </Text>

          <Text fontSize="sm">
            5. WONE Bank HRMS Purchase at same block as point 4.
          </Text>

          <Text fontSize="sm">
            6. Viper to Hermes Liquidity Migration (Minutes after purchase)
          </Text>
          <Text fontSize="sm">
            7. pHRMS to HRMS Swap Opens (Minutes after migration)
          </Text>
          <Text fontSize="sm">
            8. Farming begins (Minutes after swap opens)
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
          1. Check if you are a user accessing the bank's swap
        </Text>

        <Text fontSize="sm">
          2. Deposit your PLTS in the corresponding contract
        </Text>

        <Text fontSize="sm">3. Get pHRMS</Text>
        <Text fontSize="sm">4. Swap your pHRMS to HRMS</Text>
        <Text fontSize="sm">5. Farm it!</Text>
      </Stack>
    </Stack>
  );
};

const Page = () => {
  const currentBlock = useCurrentBlockNumber();
  const pltsActive = currentBlock < 25330605;
  const hrmsActive = currentBlock < 25213250;
  const pltsLogo = pltsActive ? "/plts-logo-on.png" : "/plts-logo-off.png";
  const hrmsLogo = hrmsActive ? "/hrms-logo-on.png" : "/hrms-logo-off.png";
  return (
    <AppLayout>
      <Stack
        align="center"
        spacing={10}
        py={16}
        justify={"center"}
      >
        <Container maxWidth="container.lg">
          <Stack
            spacing={10}
            direction={["column", "row"]}
            align={["center", "flex-start"]}
            justify={["center", "space-between"]}
            mb={10}
            ml={[0, -250]}
          >
            <Image
              src={pltsLogo}
              maxW={["0", "48"]}
            />
            <PresaleCard />
            <PresaleBankCard />
          </Stack>
          <Stack
            spacing={10}
            direction={["column", "row"]}
            align="flex-start"
            justify="flex-end"
            mb={10}
            mr={-230}
            ml={-23}
          >
            <SwapCard />
            <Image src={hrmsLogo} maxW={["0", "48"]}/>
          </Stack>
          <Timeline />
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

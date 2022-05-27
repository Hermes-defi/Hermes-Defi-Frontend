import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import {
  useApprovePHermes,
  useSwapPHermes,
  usePresaleApproveToken,
  usePresaleInfo,
  useSwapPlutus,
  useSwapBankPlutus,
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
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { usepHermesToken } from "hooks/contracts";
import {
  useCurrentBlockNumber,
  usePlutusBalance,
  useTokenBalance,
} from "hooks/wallet";

const PresaleCard = () => {
  const { account } = useActiveWeb3React();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryResp = usePresaleInfo();
  const isLoaded = !!queryResp.data;
  const approvePLTSMutation = usePresaleApproveToken();
  const swapPlutus = useSwapPlutus();
  const currentBlock = useCurrentBlockNumber();
  const active = currentBlock > 27063308 && currentBlock < 27192908;
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

            {/* <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                pHRMS Remaining
              </Text>

              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(
                    queryResp.data?.pHermesRemaining,
                    "pHRMS",
                    true
                  )}
                </Text>
              </Skeleton>
            </Stack> */}
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Starts
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.publicStartBlock}`}
                </Text>
              </Skeleton>
            </Stack>

            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Swap Ends
              </Text>
              <Skeleton isLoaded={isLoaded}>
                <Text fontWeight="700" fontSize="sm">
                  {`Block ${queryResp.data?.publicEndBlock}`}
                </Text>
              </Skeleton>
            </Stack>
            <Stack direction="row" justify="space-between">
              <Text fontWeight="600" fontSize="md">
                #RoadToHermesProtocol
              </Text>
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
          {account && !queryResp.data?.publicPltsApproved && (
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
          {account && queryResp.data?.publicPltsApproved && (
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

  const approvePltsMutation = usePresaleApproveToken();
  const swapBankPlutus = useSwapBankPlutus();
  const currentBlock = useCurrentBlockNumber();
  const active =
    currentBlock > 27063308 &&
    currentBlock < 27192908 &&
    queryResp.data?.whitelist !== "0";
  // const active = true;
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
                PLTS Swappeable with Bonus
              </Text>

              {active ? (
                <Skeleton isLoaded={isLoaded}>
                  <Text fontWeight="700" fontSize="sm">
                    {displayTokenCurrency(
                      queryResp.data?.whitelist,
                      "PLTS",
                      true
                    )}
                  </Text>
                </Skeleton>
              ) : (
                <Skeleton isLoaded={isLoaded}>
                  <Text fontWeight="700" fontSize="sm">
                    Not Whitelisted
                  </Text>
                </Skeleton>
              )}
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
          ) : !queryResp.data?.publicPltsApproved ? (
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

  const queryResp = usePresaleInfo();
  const approveMutation = useApprovePHermes();
  const pHermesContract = usepHermesToken();
  const pHermesBalance = useTokenBalance(pHermesContract.address, 18);
  const swapPHermes = useSwapPHermes();
  const currentBlock = useCurrentBlockNumber();
  const active = currentBlock > 27237008;
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

            <Skeleton isLoaded={!!queryResp.data}>
              <Text fontWeight="700" fontSize="sm">
                1 : 1
              </Text>
            </Skeleton>
          </Stack>

          {/* <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              HRMS remaining
            </Text>

            <Skeleton isLoaded={!!queryResp.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(
                  queryResp.data?.hermesRemaining,
                  "HRMS",
                  true
                )}
              </Text>
            </Skeleton>
          </Stack> */}

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Swap starts at
            </Text>
            <Skeleton isLoaded={!!queryResp.data}>
              <Text fontWeight="700" fontSize="sm">
                {`Block ${queryResp.data?.claimStartBlock}`}
              </Text>
            </Skeleton>
          </Stack>

          {account && (
            <Stack direction={["column", "row"]} justify="space-between">
              <Text fontWeight="600" fontSize="sm">
                Your pHRMS
              </Text>
              <Skeleton isLoaded={!!queryResp.data}>
                <Text fontWeight="700" fontSize="sm">
                  {displayTokenCurrency(
                    queryResp.data?.pHermesBalance,
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
            {!queryResp.data?.pHermesApproved ? (
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
  return (
    <Stack direction={"column"} mt={7} mx={10}>
      <Stack mb={7} spacing={4} flex={1}>
        <Heading fontSize="3xl">How To</Heading>

        <Text fontSize="sm">
          1. Check your PLTS balance in wallet and see how much PLTS you are
          entitled to the BONUS ratio on the bank card!
        </Text>

        <Text fontSize="sm">
          2. Use the corresponding card and swap your PLTS for pHRMS.
        </Text>

        <Text fontSize="sm">
          3. After the HRMS liquidity is added swap your pHRMS for HRMS.
        </Text>
      </Stack>
      <Stack mb={7} spacing={4} flex={1}>
        <Heading fontSize="3xl">HERMES Timeline</Heading>

        <Stack>
          <Text fontSize="sm">
            1. PLTS to pHRMS Swap Opens at block {queryResp.data?.publicStartBlock}{" "}
            (May 28th)
          </Text>

          <Text fontSize="sm">
            2. PLTS Project Owned Liquidity (90% liquidity as 5/27/22) Swapped
            15m before close
          </Text>

          <Text fontSize="sm">
            3. PLTS to pHRMS Swap Closes at block {queryResp.data?.publicEndBlock}{" "}
            (May 30th)
          </Text>
          <Text fontSize="sm">
            ALL PLTS MUST BE SWAPPED BEFORE PLTS SWAP CLOSES
          </Text>

          <Text fontSize="sm">
            4. HRMS Liquidity Added at block 27236108 APPROX. (May 31th)
          </Text>

          <Text fontSize="sm">
            5. WONE Bank HRMS Purchase at same block as point 4.
          </Text>

          <Text fontSize="sm">
            6. Viper to Hermes Liquidity Migration APPOX. (5m/10m after
            liquidity adition)
          </Text>
          <Text fontSize="sm">
            7. pHRMS to HRMS Swap Opens at block at block {queryResp.data?.claimStartBlock} (30m after
            liquidity adition)
          </Text>
          <Text fontSize="sm">
            8. Farming begins APPROX. (30/45m after swap opens)
          </Text>
        </Stack>

        <Text fontSize="sm">
          For more details visit:{" "}
          <Link
            isExternal
            color="blue.600"
            href="https://docs.hermesdefi.io/the-hermes-protocol/timeline"
          >
            https://docs.hermesdefi.io/the-hermes-protocol/timeline
          </Link>
        </Text>

        <Text fontSize="sm">
          The volatility of the blocks in Harmony is very high. We recommend
          reviewing them to check the times.
        </Text>
      </Stack>
    </Stack>
  );
};

const Page = () => {
  const currentBlock = useCurrentBlockNumber();
  // const pltsActive = currentBlock < 25330605;
  const pltsActive = currentBlock > 27063308 && currentBlock < 27192908;
  const hrmsActive = currentBlock > 27237008;
  const pltsLogo = pltsActive ? "/plts-logo-on.png" : "/plts-logo-off.png";
  const hrmsLogo = hrmsActive ? "/hrms-logo-on.png" : "/hrms-logo-off.png";
  const queryResp = usePresaleInfo();
  const pltsWallet = usePlutusBalance();
  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={16} justify={"center"}>
        <Container maxWidth="container.lg">
          <Stack
            spacing={10}
            direction={["column", "row"]}
            align={["center"]}
            justify={["space-evenly"]}
            mb={10}
            ml={[0]}
          >
            <Badge
              align="center"
              bg={useColorModeValue("white", "gray.700")}
              px={[5, 10]}
              py={6}
              rounded={"2xl"}
              boxShadow="base"
              h={"max-content"}
            >
              <Heading
                align="center"
                color={useColorModeValue("accent.400", "accent.200")}
                fontSize="2xl"
              >
                PLTS Balance in Wallet :{" "}
                {displayTokenCurrency(pltsWallet, "PLTS", true)}
              </Heading>
            </Badge>
            <Badge
              align="center"
              bg={useColorModeValue("white", "gray.700")}
              px={[5, 10]}
              py={6}
              rounded={"2xl"}
              boxShadow="base"
              h={"max-content"}
            >
              <Heading
                align="center"
                color={useColorModeValue("accent.400", "accent.200")}
                fontSize="2xl"
              >
                Total pHRMS Remaining:{" "}
                {displayTokenCurrency(
                  queryResp.data?.pHermesRemaining,
                  "pHRMS",
                  true
                )}
              </Heading>
            </Badge>
          </Stack>
          <Stack
            spacing={10}
            direction={["column", "row"]}
            align={["center", "flex-start"]}
            justify={["center", "space-between"]}
            mb={10}
            ml={[0, -250]}
          >
            <Image src={pltsLogo} maxW={["0", "48"]} />
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
            <Image src={hrmsLogo} maxW={["0", "48"]} />
          </Stack>
          <Timeline />
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

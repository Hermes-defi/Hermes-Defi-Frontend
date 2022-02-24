import React from "react";

import { displayCurrency, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { useApprovePPlutus, useBuyPPlutus, usePresaleApproveToken, usePresaleInfo, useSwapInfo, useSwapPPlutus } from "state/pre-sale";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuyPlutusModal } from "components/modals/buy-plutus";

import { Box, Button, Container, Heading, HStack, Input, InputGroup, InputLeftAddon, Link, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { BuypPlutusModal } from "components/modals/buy-pPlutus";

const MapperCard = () => {
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
        mb={10}
      >
        <Box>
          <HStack mb={6}>
            <Text fontWeight="700" fontSize="2xl">
              Map ONE Wallet to Metamask
            </Text>
          </HStack>

          {/* pool details */}
          <Stack mb={6}>
            
            <Stack direction="row" justify="space-between">
              <InputGroup>
                <InputLeftAddon bgColor={"secondary.600"} children='Address'/>
                <Input variant="outline" bgColor={"secondary.400"} placeholder="0x"/>
              </InputGroup>
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
              Map
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

const StakeCard = () => {
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
          <Text fontWeight="700" fontSize="2xl">
            Claim your PLTS rewards!
          </Text>
        </HStack>

        {/* pool details */}
        <Stack mb={6} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Harvest PLTS
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                1 : 1
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              APR
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.pPlutusRemaining, "pPLUTUS", true)}
              </Text>
            </Skeleton>
          </Stack>

          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              EPOCH remaining
            </Text>

            <Skeleton isLoaded={!!swapInfo.data}>
              <Text fontWeight="700" fontSize="sm">
                {displayTokenCurrency(swapInfo.data?.plutusRemaining, "PLUTUS", true)}
              </Text>
            </Skeleton>
          </Stack>

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
                Harvest
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
      <Stack align="center" py={5}>
        <Container maxWidth="container.lg">
          <Stack spacing={10} direction={["column-reverse", "row"]} align="flex-start" justify="space-between">
            <Stack flex={1}>
              <MapperCard />
              <StakeCard/>
            </Stack>

            <Stack flex={1} mb={7} spacing={4}>
              <Heading fontSize="3xl">How it works</Heading>

              <Stack>
                <Text fontSize="sm">
                  1. Delegate to Hermes DeFi using the official Harmony Staking Platform  {" "} 
                  <Link 
                    isExternal
                    color="blue.600" 
                    href="https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5">
                        link
                    </Link>
                    .
                </Text>
                

                <Text fontSize="sm">
                  2. If necessary, map your delegating wallet with the wallet you'd like to receive rewards in.
                </Text>

                {/* <Text fontSize="sm">
                  3. Waiting room. Ongoing (<Link href="app/waiting-room">here</Link>)
                </Text> */}
                <Text fontSize="sm">
                  3. Rewards are distributed every Epoch, and can be harvested from this page.
                </Text>

              </Stack>

              <Text fontSize="sm">
                For more details visit, see our doc:{" "}
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

            </Stack>
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

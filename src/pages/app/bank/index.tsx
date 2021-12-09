import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useApproveBank,
  useBankStats,
  useDepositInBank,
  useEnrollInPool,
  useFetchMainPool,
  useFetchPools,
  useHasApprovedPool,
  useRewardInfo,
} from "state/bank";
import { displayCurrency, displayNumber } from "libs/utils";
import { usePlutusBalance } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";
import { UnlockButton } from "components/wallet/unlock-wallet";

export function BankNavigation() {
  return (
    <Stack divider={<StackDivider borderColor="gray.200" />} direction="row" justify="center">
      <NextLink href="/app/bank" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">Bank</Heading>
          </Button>
        </a>
      </NextLink>

      <NextLink href="/app/bank/my" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">My Earnings</Heading>
          </Button>
        </a>
      </NextLink>

      <NextLink href="/app/bank/lottery" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">Lottery</Heading>
          </Button>
        </a>
      </NextLink>
      <NextLink href="https://hermes-defi.gitbook.io/plutus/products/bank" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">More Info</Heading>
          </Button>
        </a>
      </NextLink>
    </Stack>
  );
}

function BankStats() {
  const rewardInfo = useRewardInfo();

  return (
    <Stack
      direction="row"
      justify="space-around"
      align="center"
      flex="1"
      bg={useColorModeValue("white", "gray.700")}
      rounded="2xl"
      boxShadow="base"
      px={[5, 10]}
      py={{ base: 10, md: 6 }}
    >
      <Stack align="center">
        <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize={{ base: "xl", md: "2xl" }}>
          Total APR
        </Heading>

        <Skeleton isLoaded={!rewardInfo.isLoading}>
          <Heading color="accent.400" fontSize="4xl">
            {displayNumber(rewardInfo.aprs, false, 2)}%
          </Heading>
        </Skeleton>
      </Stack>

      <Stack align="center">
        <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize={{ base: "xl", md: "2xl" }}>
          Total Rewards
        </Heading>

        <Skeleton isLoaded={!rewardInfo.isLoading}>
          <Heading color="accent.400" fontSize="4xl">
            {displayCurrency(rewardInfo.totalRewards, false)}
          </Heading>
        </Skeleton>
      </Stack>
    </Stack>
  );
}

function DepositSection() {
  const [amount, setAmount] = React.useState("");
  const { account } = useActiveWeb3React();
  const plutusBalance = usePlutusBalance();
  const hasApprovedPool = useHasApprovedPool();
  const approveMutation = useApproveBank();
  const depositeMutation = useDepositInBank();

  return (
    <Box flex="1" bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
      <Box mb={8}>
        <Heading mb={1} color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
          Deposit Plutus
        </Heading>
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.100")}>
          Burn your $PLUTUS to earn $DAI + partner pool rewards.
        </Text>
      </Box>

      <Stack justify="center" spacing={5}>
        <Stack align="center" direction="row" borderWidth="1px" borderColor="blackAlpha.500" px={3} py={2} rounded="xl">
          <Input
            _focus={{ outline: "none" }}
            isDisabled={!hasApprovedPool.data}
            pl={0}
            borderWidth="0px"
            fontSize="2xl"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            maxLength={79}
            minLength={1}
            spellCheck={false}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />

          <Button
            size="sm"
            variant="outline"
            colorScheme="secondary"
            isDisabled={!hasApprovedPool.data}
            onClick={() => setAmount(plutusBalance)}
          >
            Max
          </Button>
        </Stack>

        <Text fontSize="sm">Balance: {displayNumber(plutusBalance, false, 3)} PLUTUS</Text>

        {!account ? (
          <UnlockButton w="50%" colorScheme="accent" />
        ) : (
          <Stack direction="row">
            <Button
              isFullWidth
              isDisabled={hasApprovedPool.data}
              isLoading={approveMutation.isLoading}
              onClick={() => approveMutation.mutate()}
              variant="solid"
              colorScheme="primary"
            >
              Approve Bank
            </Button>

            <Button
              isFullWidth
              isDisabled={!hasApprovedPool.data}
              isLoading={depositeMutation.isLoading}
              onClick={() => depositeMutation.mutateAsync(amount).then(() => setAmount(""))}
              variant="solid"
              colorScheme="primary"
            >
              Deposit PLUTUS
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

function Pool({ pool }) {
  const enrollMutation = useEnrollInPool();

  return (
    <Stack
      spacing={5}
      bg={useColorModeValue("secondary.400", "primary.400")}
      bgGradient={"linear(to-b, secondary.200, accent.500)"}
      color={"white"}
      px={6}
      py={5}
      rounded="xl"
    >
      <Stack direction="row" justify="space-between">
        <Stack direction="row" align="center">
          <Image objectFit="contain" src={`/${pool?.poolName}-logo.png`} boxSize={8} />
          <Text fontSize="sm" textTransform="uppercase" fontWeight="bold">
            {pool?.poolName} Reward
          </Text>
        </Stack>

        {pool?.isNew && (
          <Stack rounded="lg" px={2} bg="primary.400" justify="center" align="center">
            <Text fontWeight="bold" fontSize="xs" textTransform="uppercase">
              New
            </Text>
          </Stack>
        )}
      </Stack>

      {/* bank info */}
      <Stack textAlign="right" spacing={0}>
        <Text fontWeight="semibold" fontSize="sm">
          APR
        </Text>
        <Text fontWeight="bold" fontSize="4xl">
          {displayNumber(pool?.apr)}%
        </Text>
        <Text fontSize="md" fontWeight="semibold" textTransform="uppercase">
          {displayNumber(pool?.poolAmount, false, 3)} {pool?.poolName}
        </Text>

        <Text fontSize="md" fontWeight="semibold">
          {pool?.timeLeft || 0} left
        </Text>
      </Stack>

      <Button
        isFullWidth
        isDisabled={pool?.enrolled}
        textTransform="uppercase"
        variant="action"
        isLoading={enrollMutation.isLoading}
        onClick={() => enrollMutation.mutate(pool?.pid)}
      >
        {pool?.enrolled ? "Enrolled" : "Enroll"}
      </Button>
    </Stack>
  );
}

const Page = () => {
  const mainPool = useFetchMainPool();
  const pools = useFetchPools();
  const stats = useBankStats();

  return (
    <AppLayout>
      <Container maxWidth="container.lg" my={8}>
        <Stack spacing={8}>
          <BankNavigation />

          <Stack w="100%" rounded="xl" spacing={6} py={[4, 8]} px={[0, 8]}>
            <Stack direction={{ base: "column-reverse", md: "row" }} align="stretch">
              <BankStats />
              <DepositSection />
            </Stack>

            {mainPool.data && (
              <Box
                flex="1"
                bgGradient={"linear(to-b, primary.200, accent.400)"}
                color="white"
                rounded="2xl"
                boxShadow="base"
                px={[5, 10]}
                py={6}
              >
                <Stack direction="row" align="center">
                  <Image objectFit="contain" src={`/1dai-logo.png`} boxSize={10} />
                  <Text fontSize="md" textTransform="uppercase" fontWeight="bold">
                    1dai bank
                  </Text>
                </Stack>

                <Stack mt={8} direction={["column", "row"]} justify="space-around" spacing={[5, 10]}>
                  <Stack align="center">
                    <Heading color="gray.50" fontSize="xl">
                      APR
                    </Heading>

                    <Heading color="white" fontSize="4xl">
                      {displayNumber(mainPool.data?.apr, false, 2)}%
                    </Heading>
                  </Stack>

                  <Stack align="center">
                    <Heading color="gray.50" fontSize="xl">
                      Rewards
                    </Heading>

                    <Heading color="white" fontSize="4xl">
                      {displayCurrency(mainPool.data?.totalRewardsInUsd)}
                    </Heading>
                  </Stack>

                  <Stack align="center">
                    <Heading color="gray.50" fontSize="xl">
                      DAI paid out
                    </Heading>

                    <Heading color="white" fontSize="4xl">
                      {displayNumber(mainPool.data?.poolTotalPayout, false, 2)}
                    </Heading>
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* rewards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {pools.map(({ data: pool }: any) => {
                if (!pool) return null;
                return <Pool pool={pool} key={pool.pid} />;
              })}
            </SimpleGrid>

            <Stack
              spacing={7}
              bg={useColorModeValue("white", "gray.700")}
              rounded="2xl"
              boxShadow="base"
              px={[5, 10]}
              py={6}
            >
              <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                Burn Stats
              </Heading>

              <Stack spacing={[4, 2]}>
                <Stack direction={["column", "row"]} justify="space-between">
                  <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                    Total PLUTUS burnt in bank
                  </Heading>

                  <Skeleton isLoaded={!!stats.data}>
                    <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
                      {displayNumber(stats.data?.totalBurntInBank, false, 2)}
                    </Text>
                  </Skeleton>
                </Stack>

                <Stack direction={["column", "row"]} justify="space-between">
                  <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                    % PLUTUS burnt in bank
                  </Heading>
                  <Skeleton isLoaded={!!stats.data}>
                    <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
                      {displayNumber(stats.data?.percentageBurntInBank, false, 2)}%
                    </Text>
                  </Skeleton>
                </Stack>

                <Stack direction={["column", "row"]} justify="space-between">
                  <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                    Total PLUTUS burnt (bank + tax)
                  </Heading>

                  <Skeleton isLoaded={!!stats.data}>
                    <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
                      {displayNumber(stats.data?.totalBurnt, false, 2)}
                    </Text>
                  </Skeleton>
                </Stack>

                <Stack direction={["column", "row"]} justify="space-between">
                  <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
                    % PLUTUS burnt (bank + tax)
                  </Heading>
                  <Skeleton isLoaded={!!stats.data}>
                    <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
                      {displayNumber(stats.data?.percentageBurnt, false, 2)}%
                    </Text>
                  </Skeleton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import {
  Button,
  Container,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useApproveBank,
  useBankStats,
  useDepositedAmount,
  useDepositInBank,
  useEnrollInPool,
  useFetchMainPool,
  useFetchPools,
  useHasApprovedPool,
} from "state/bank";
import { displayCurrency, displayNumber, truncateAddress } from "libs/utils";
import { useApolloBalance } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { useApolloPrice } from "hooks/prices";

function DepositSection() {
  const [amount, setAmount] = React.useState("");
  const { account } = useActiveWeb3React();
  const userDepositedAmount = useDepositedAmount();
  const apolloBalance = useApolloBalance();
  const hasApprovedPool = useHasApprovedPool();
  const approveMutation = useApproveBank();
  const depositeMutation = useDepositInBank();

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      p={7}
      rounded="xl"
      bg={useColorModeValue("secondary.400", "secondary.400")}
      bgGradient="linear(to-b, whiteAlpha.600, accent.500)"
      color={"white"}
      spacing={5}
    >
      <Stack flex="1" textAlign="center" align="center" spacing={3}>
        <Text pb={2} fontWeight="bold" textTransform="uppercase" fontSize="sm">
          {displayNumber(apolloBalance, false, 3)} APOLLO available
        </Text>

        <Stack align="center" direction="row" borderWidth="1px" borderColor="whiteAlpha.500" px={3} py={2} rounded="xl">
          <Input
            _focus={{ outline: "none" }}
            _placeholder={{ color: "white" }}
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
            borderColor="whiteAlpha.500"
            color="white"
            isDisabled={!hasApprovedPool.data}
            onClick={() => setAmount(apolloBalance)}
            _hover={{ bg: "transparent", borderColor: "whiteAlpha.900" }}
          >
            Max
          </Button>
        </Stack>

        {!account ? (
          <UnlockButton w="50%" variant="action" />
        ) : (
          <Stack direction={["column", "row"]} spacing={[4, 10]}>
            <Button
              isDisabled={hasApprovedPool.data}
              isLoading={approveMutation.isLoading}
              onClick={() => approveMutation.mutate()}
              variant="action"
            >
              Approve Bank
            </Button>

            <Button
              isDisabled={!hasApprovedPool.data}
              isLoading={depositeMutation.isLoading}
              onClick={() => depositeMutation.mutateAsync(amount).then(() => setAmount(""))}
              variant="action"
            >
              Burn APOLLO
            </Button>
          </Stack>
        )}
      </Stack>

      <Stack flex="1" textAlign="center" justify="center">
        <Text pb={2} fontWeight="bold" textTransform="uppercase" fontSize="sm">
          My Burnt APOLLO
        </Text>

        <Stack flex="1" align="center" justify="center">
          <Skeleton isLoaded={!userDepositedAmount.isLoading}>
            <Text fontWeight="900" fontSize="xl">
              {displayNumber(userDepositedAmount.data || 0, false, 3)} APOLLO
            </Text>
          </Skeleton>
        </Stack>
      </Stack>
    </Stack>
  );
}

function Pool({ pool }) {
  const enrollMutation = useEnrollInPool();

  return (
    <Stack
      spacing={5}
      bg={useColorModeValue("secondary.400", "primary.400")}
      bgGradient={"linear(to-b, whiteAlpha.600, accent.500)"}
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
          {displayNumber(pool?.poolAmount, false, 6)} {pool?.poolName}
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

function Stats() {
  const stats = useBankStats();
  const apolloPrice = useApolloPrice();

  return (
    <Stack border="1px" borderColor={useColorModeValue("gray.400", "whiteAlpha.100")} p={7} rounded="xl" spacing={7}>
      <Heading fontSize="lg" borderBottom="1px" w={20}>
        Bank Stats
      </Heading>

      <Stack spacing={1}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            APOLLO Price
          </Text>
          <Skeleton isLoaded={!!apolloPrice.data}>
            <Text fontWeight="bold" color={useColorModeValue("primary.400", "primary.200")}>
              {displayCurrency(apolloPrice.data || 0)}
            </Text>
          </Skeleton>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            % of burnt APOLLO
          </Text>
          <Skeleton isLoaded={!!stats.data}>
            <Text fontWeight="bold" color={useColorModeValue("primary.400", "primary.200")}>
              {displayNumber(stats.data?.percentageBurnt, false, 3)}%
            </Text>
          </Skeleton>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            Total APOLLO burnt
          </Text>
          <Skeleton isLoaded={!!stats.data}>
            <Text fontWeight="bold" color={useColorModeValue("primary.400", "primary.200")}>
              {stats.data?.totalBurnt}
            </Text>
          </Skeleton>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            Last lottery winner
          </Text>
          <Skeleton isLoaded={!!stats.data}>
            <Text fontWeight="bold" color={useColorModeValue("primary.300", "primary.200")}>
              {truncateAddress(stats.data?.lotteryWinner || "", 4)}
            </Text>
          </Skeleton>
        </Stack>
      </Stack>
    </Stack>
  );
}

const Page = () => {
  const mainPool = useFetchMainPool();
  const pools = useFetchPools();

  return (
    <AppLayout>
      <Container maxWidth="container.lg" my={8}>
        <Stack spacing={8}>
          <Stack direction="row" justify="flex-end">
            <NextLink href="/app/bank" passHref>
              <a>
                <Button colorScheme="accent">Bank</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/my" passHref>
              <a>
                <Button colorScheme="accent">My Pot</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/lottery" passHref>
              <a>
                <Button colorScheme="secondary">Lottery</Button>
              </a>
            </NextLink>
          </Stack>

          <Stack w="100%" bg="gray.900" color="white" rounded="xl" spacing={6} py={8} px={8}>
            {/* deposit */}
            <DepositSection />

            {/* rewards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {mainPool.data && (
                <Stack
                  w="100%"
                  spacing={5}
                  bgGradient={"linear(to-b, whiteAlpha.600, green.500)"}
                  color={"white"}
                  px={6}
                  py={5}
                  rounded="xl"
                >
                  <Stack direction="row" justify="space-between">
                    <Stack direction="row" align="center">
                      <Image objectFit="contain" src={`/iron-logo.png`} boxSize={10} />
                      <Text fontSize="md" textTransform="uppercase" fontWeight="bold">
                        iron bank
                      </Text>
                    </Stack>

                    <Stack justify="center" align="center">
                      <Text
                        rounded="lg"
                        px={4}
                        py={2}
                        bg="primary.400"
                        fontWeight="bold"
                        fontSize="xs"
                        textTransform="uppercase"
                      >
                        New
                      </Text>
                    </Stack>
                  </Stack>

                  {/* bank info */}
                  <Stack textAlign="right" spacing={0}>
                    <Text fontWeight="semibold" textTransform="uppercase" fontSize="md">
                      Reward
                    </Text>
                    <Text fontWeight="bold" fontSize="4xl">
                      {displayCurrency(mainPool.data?.cycleRewards)}/cycle*
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" textTransform="uppercase">
                      {displayNumber(mainPool.data?.apr)}%
                    </Text>

                    <Text fontSize="md" fontWeight="semibold">
                      {displayNumber(mainPool.data?.poolTotalPayout)} IRON paid out
                    </Text>
                  </Stack>

                  <Button isFullWidth isDisabled textTransform="uppercase" variant="action">
                    Enrolled
                  </Button>

                  <Text align="right" fontSize="sm">
                    *A cycle is every 3 days
                  </Text>
                </Stack>
              )}

              {pools.map(({ data: pool }: any) => {
                if (!pool) return null;
                return <Pool pool={pool} key={pool.pid} />;
              })}
            </SimpleGrid>

            {/* info */}
            <Stats />
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

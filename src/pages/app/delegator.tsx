import React, { useState } from "react";

import { displayNumber } from "libs/utils";
import { useActiveWeb3React } from "wallet";

import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  useDepositIntoDelegator,
  useFetchDelegators,
  useFetchPools,
  useUnstakeFromDelegator,
  useWithdrawFromDelegator,
} from "state/delegator";
import tokens from "config/tokens";
import { useTokenBalance } from "hooks/wallet";
import { DelegatorInfo } from "config/delegators";
import { Pool, pools } from "config/delegator-pools";
import { PlutusAPRCalculator } from "components/helpers/apr-calculator";
import { PoolCard } from "components/cards/delegator-card";
import { useToggle } from "react-use";

const DepositCard = () => {
  const { account } = useActiveWeb3React();
  const queryResp = useFetchDelegators();
  const isLoading = queryResp.every((f) => f.status === "loading");
  const [depositValue, setDepositValue] = useState("");
  const pool = queryResp[0].data as DelegatorInfo;
  const depositMutation = useDepositIntoDelegator();

  let balance = useTokenBalance(tokens.wone.address, tokens.wone.decimals);
  console.log("🚀 ~ file: delegator.tsx ~ line 49 ~ DepositCard ~ balance", balance)
  
  return (
    <>
      <Stack
        justify="space-between"
        px={8}
        py={8}
        boxShadow="lg"
        rounded="3xl"
        bg="secondary.300"
        bgGradient="linear(to-b, secondary.300, secondary.200)"
        color="white"
        w={["19rem", "lg"]}
      >
        <Box mb={3}>
          <HStack mb={3} justify={"space-between"}>
            <Heading fontWeight="700" fontSize="3xl">
              Stake ONE
            </Heading>
            <Heading
              px={"5"}
              py={1}
              color={"secondary.300"}
              boxSize={12}
              rounded={"full"}
              bgColor={"white"}
              fontWeight="700"
              fontSize="4xl"
            >
              1
            </Heading>
          </HStack>

          {/* pool details */}
          <Stack>
            <Stack direction="row" justify="space-between">
              <InputGroup>
                <InputLeftAddon
                  px={3}
                  fontSize={"xs"}
                  bgColor={"gray.700"}
                  children="$ONE"
                />
                <Input
                  variant="outline"
                  placeholder={"100"}
                  min={100}
                  max={balance}
                  type="number"
                  _focus={{ outline: "none" }}
                  pattern="^[0-9]*[.,]?[0-9]*"
                  focusBorderColor="secondary.500"
                  onChange={(e) => setDepositValue(e.target.value)}
                  // value={
                  //   Number(depositValue) >= 100
                  //     ? Number(depositValue).toString()
                  //     : "100"
                  // }
                />
              </InputGroup>
            </Stack>
          </Stack>
          <Stack mt={5} direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              APY
            </Text>

            <Skeleton isLoaded={!isLoading}>
              <Box display="flex" alignItems="center">
                {/* {pool?.apr && (
                  <PlutusAPRCalculator
                    apr={pool?.apr}
                    tokenSymbol={"ONE"}
                    tokenLink={
                      "https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5"
                    }
                  />
                )} */}
                <Text fontWeight="700" fontSize="sm">
                  {pool?.apr
                    ? `${displayNumber(Math.round(pool?.apr.yearlyAPR))}%`
                    : "N/A"}
                </Text>
              </Box>
            </Skeleton>
          </Stack>
          <Stack mt={1} direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Balance of ONE
            </Text>

            <Skeleton isLoaded={!isLoading}>
              <Box display="flex" alignItems="center">
                <Text fontWeight="700" fontSize="sm">
                  {balance}
                </Text>
              </Box>
            </Skeleton>
          </Stack>
        </Box>
        {/* actions */}
        <Stack>
          {!account ? (
            <UnlockButton
              isFullWidth
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
              color={"white"}
            />
          ) : (
            <Button
              isFullWidth
              onClick={() =>
                depositMutation.mutate({
                  address: pool?.address,
                  amount: depositValue,
                })
              }
              bg="gray.700"
              size="md"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
              disabled={new Number(depositValue) < 100 ? true : false}
            >
              Deposit
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

function useEpochTimeLeft(timeout: any) {
  const [timeLeft, setTimeLeft] = React.useState(timeout);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeout);
    }, 1000);

    return () => clearTimeout(timer);
  });

  let timerComponents: any = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return timerComponents;
}

const UnstakeCard = () => {
  const { account } = useActiveWeb3React();
  const queryResp = useFetchDelegators();
  const isLoading = queryResp.every((f) => f.status === "loading");

  const [unstakeValue, setUnstakeValue] = useState("");
  const unstakeMutation = useUnstakeFromDelegator();
  const pool = queryResp[0].data as DelegatorInfo;

  let balance = useTokenBalance(tokens.wone.address, tokens.wone.decimals);
  return (
    <>
      <Stack
        justify="space-between"
        px={8}
        py={8}
        boxShadow="lg"
        rounded="3xl"
        bg="secondary.300"
        bgGradient="linear(to-b, secondary.300, secondary.200)"
        color="white"
        w={["19rem", "lg"]}
      >
        <Box mb={3}>
          <HStack mb={3} justify={"space-between"}>
            <Heading fontWeight="700" fontSize="3xl">
              Unstake ONE
            </Heading>
            <Heading
              px={"4"}
              py={1}
              color={"secondary.300"}
              boxSize={12}
              rounded={"full"}
              bgColor={"white"}
              fontWeight="700"
              fontSize="4xl"
            >
              3
            </Heading>
          </HStack>
          {/* pool details */}
          <Stack>
            <Stack direction="row" justify="space-between">
              <InputGroup>
                <InputLeftAddon
                  px={3}
                  fontSize={"xs"}
                  bgColor={"gray.700"}
                  children="$hONE"
                />
                <Input
                  variant="outline"
                  placeholder="100"
                  min="0"
                  max={pool?.stakedOne}
                  type="number"
                  _focus={{ outline: "none" }}
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  focusBorderColor="secondary.500"
                  onChange={(e) => setUnstakeValue(e.target.value)}
                />
              </InputGroup>
            </Stack>
          </Stack>
          <Stack mt={5} direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Balance of hONE
            </Text>

            <Skeleton isLoaded={!isLoading}>
              {pool?.rewardBalance !== "0.0" ? (
                <Text fontWeight="700" fontSize="sm">
                  {pool?.rewardBalance}
                </Text>
              ) : (
                <Text fontWeight="700" fontSize="sm">
                  0.0
                </Text>
              )}
            </Skeleton>
          </Stack>
        </Box>

        {/* actions */}
        <Stack>
          {!account ? (
            <UnlockButton
              isFullWidth
              bg="gray.700"
              size="lg"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
              color={"white"}
            />
          ) : (
            <Button
              isFullWidth
              onClick={() =>
                unstakeMutation.mutate({
                  address: pool?.address,
                  amount: unstakeValue,
                })
              }
              bg="gray.700"
              size="md"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
              disabled={new Number(unstakeValue) < 100 ? true : false}
            >
              Unstake
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

const WithdrawCard = () => {
  const { account } = useActiveWeb3React();
  const queryResp = useFetchDelegators();
  const isLoading = queryResp.every((f) => f.status === "loading");
  // const timerComponents = useEpochTimeLeft(isLoading ? 0 : queryResp[0].data?.unstakeInfo)
  const withdrawMutation = useWithdrawFromDelegator();
  const [withdrawValue, setWithdrawValue] = useState("");
  const pool = queryResp[0].data as DelegatorInfo;

  return (
    <Stack
      px={8}
      py={8}
      boxShadow="lg"
      rounded="3xl"
      bg="secondary.400"
      bgGradient="linear(to-b, secondary.400, secondary.300)"
      color="white"
      w={["19rem", "lg"]}
    >
      <Box>
        <HStack align="center" mb={5} justify={"space-between"}>
          <Heading fontWeight="700" fontSize="3xl">
            Claim your ONE
          </Heading>
          <Heading
            px={"3"}
            py={1}
            color={"secondary.300"}
            boxSize={12}
            rounded={"full"}
            bgColor={"white"}
            fontWeight="700"
            fontSize="4xl"
          >
            4
          </Heading>
        </HStack>
      </Box>

      {/* actions */}
      <Stack mb={8} spacing={6}>
        <InputGroup>
          <InputLeftAddon
            px={3}
            fontSize={"xs"}
            bgColor={"gray.700"}
            children="$ONE"
          />
          <Input
            variant="outline"
            placeholder="0"
            min="0"
            max={pool?.stakedOne}
            type="number"
            _focus={{ outline: "none" }}
            pattern="^[0-9]*[.,]?[0-9]*$"
            focusBorderColor="secondary.500"
            onChange={(e) => setWithdrawValue(e.target.value)}
            value={
              Number(withdrawValue) > 0 ? Number(withdrawValue).toString() : "0"
            }
          />
        </InputGroup>
        <Stack mb={3} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Queued ONE
            </Text>

            <Skeleton isLoaded={!isLoading}>
              {pool?.stakedOne !== "0.0" ? (
                <Text fontWeight="700" fontSize="sm">
                  {pool?.stakedOne}
                </Text>
              ) : (
                <Text fontWeight="700" fontSize="sm">
                  0.0
                </Text>
              )}
            </Skeleton>
          </Stack>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              EPOCH remaining
            </Text>

            <Skeleton isLoaded={!isLoading}>
              {pool?.unstakeInfo !== undefined ? (
                <Text fontWeight="700" fontSize="sm">
                  {pool?.canWithdraw === false
                    ? pool?.unstakeInfo?.hours +
                      "h " +
                      pool?.unstakeInfo?.minutes +
                      "min " +
                      pool?.unstakeInfo?.seconds +
                      "s"
                    : "Withdraw avaliable"}
                </Text>
              ) : (
                <Text fontWeight="700" fontSize="sm">
                  Need to unstake first
                </Text>
              )}
            </Skeleton>
          </Stack>
          {!account ? (
            <UnlockButton
              isFullWidth
              bg="gray.700"
              size="md"
              fontSize="md"
              _hover={{ bg: "gray.600" }}
              color={"white"}
            />
          ) : (
            <>
              {pool?.canWithdraw == true ? (
                <Button
                  isLoading={withdrawMutation.isLoading}
                  onClick={() =>
                    withdrawMutation.mutate({
                      address: pool?.address,
                      amount: withdrawValue,
                    })
                  }
                  bg="gray.700"
                  size="md"
                  fontSize="md"
                  _hover={{ bg: "gray.600" }}
                >
                  Harvest
                </Button>
              ) : (
                <Button
                  bg="gray.700"
                  size="md"
                  fontSize="md"
                  _hover={{ bg: "gray.600" }}
                  disabled
                >
                  Wait until EPOCH passes
                </Button>
              )}
            </>
          )}
        </Stack>
          <Stack align={"center"}>
              <Heading fontSize="3xl" mt={3}>How it works</Heading>
            </Stack>
            <Stack direction={"row"} mb={3}>
              <Stack align={"start"}>
                <Text fontSize="sm" fontWeight={600}>
                  1. Delegate to Hermes DeFi Node staking your ONE in the first
                  card. (Minimum deposit = 100 ONEs)
                </Text>

                <Text fontSize="sm" fontWeight={600}>
                  2. You can stake your share into the hONE pool in the pools
                  section and win PLTS.
                </Text>
                <Text fontSize="sm" fontWeight={600}>
                  3. In case that you want to unstake your hONE:
                </Text>
              </Stack>

              {/* <Text fontSize="sm">
                  3. Waiting room. Ongoing (<Link href="app/waiting-room">here</Link>)
                </Text> */}
              <Stack>

                <Text fontSize="sm" fontWeight={600}>
                  3.1. Withdraw your hONE from the pool.
                </Text>

                <Text fontSize="sm" fontWeight={600}>
                  3.2 Set the amount of hONE that you want back and click into
                  the unstake button.
                </Text>

                <Text fontSize="sm" fontWeight={600}>
                  4. Wait until the next epoch to withdraw your staked + reward
                  ONE.
                </Text>
              </Stack>
            </Stack>
      </Stack>
    </Stack>
  );
};

const Page = () => {
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);
  const poolsResp = useFetchPools();
  const isLoading = poolsResp.every((f) => f.status === "loading");
  const pool = isLoading ? null :  poolsResp[0].data as Pool;

  let pools = poolsResp
    .filter((pool: any) => pool.data?.isActive === active)
    .filter((pool: any) =>
      stakedOnly ? pool.data?.hasStaked === stakedOnly : true
    );

  return (
    <AppLayout>
      <Stack align="center" py={5}>
        <Container maxWidth="container.lg">
          <Stack spacing={16} direction={["column"]} align="center">
            <Stack spacing={5} justify={"center"}>
              <Stack direction={"row"} spacing={5}>
                <DepositCard />
                <UnstakeCard />
              </Stack>
              <Stack direction={"row"} spacing={5}>
                {isLoading ? (
                  <Flex mt={16} align="center" justify="center">
                    <Spinner size="xl" />
                  </Flex>
                ) : (
                  <PoolCard key={pool?.pid} pool={pool} />
                )}
                <WithdrawCard />
              </Stack>
            </Stack>
            <Stack align={"center"}>
              <Text fontSize="sm" fontWeight={800}>
                Thats a beta version. Use carefully at your
                own risk. Final version will be deployed at Hermes Protocol
                launch, with a full CertiK audition.
              </Text>
              <Text fontSize="sm" fontWeight={600}>
                For more details visit, see our doc:{" "}
                <Link
                  isExternal
                  color="blue.600"
                  href="https://hermes-defi.gitbook.io/the-hermes-protocol/"
                >
                  https://hermes-defi.gitbook.io/the-hermes-protocol/
                </Link>
              </Text>
            </Stack>
           
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

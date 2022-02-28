import React, { useState } from "react";

import {
  displayCurrency,
  displayNumber,
  displayTokenCurrency,
} from "libs/utils";
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
  useDisclosure,
} from "@chakra-ui/react";
import { BuypPlutusModal } from "components/modals/buy-pPlutus";
import {
  formatTimeLeft,
  useDepositIntoDelegator,
  useFetchDelegatorPools,
  useUnstakeFromDelegator,
  useWithdrawFromDelegator,
} from "state/delegator";
import tokens from "config/tokens";
import { useTokenBalance } from "hooks/wallet";
import { DelegatorInfo } from "config/delegators";
import { PlutusAPRCalculator } from "components/helpers/apr-calculator";

const DepositCard = () => {
  const { account } = useActiveWeb3React();
  const queryResp = useFetchDelegatorPools();
  const isLoading = queryResp.every((f) => f.status === "loading");
  const [depositValue, setDepositValue] = useState("");
  const pool = queryResp[0].data as DelegatorInfo;
  const depositMutation = useDepositIntoDelegator();

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
        w={"15rem"}
      >
        <Box mb={3}>
          <HStack mb={3}>
            <Text fontWeight="700" fontSize="2xl">
              Stake ONE
            </Text>
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
          ): ( 
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
  const queryResp = useFetchDelegatorPools();
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
        w={"15rem"}
      >
        <Box mb={3}>
          <HStack mb={3}>
            <Text fontWeight="700" fontSize="2xl">
              Unstake ONE
            </Text>
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
  const queryResp = useFetchDelegatorPools();
  const isLoading = queryResp.every((f) => f.status === "loading");
  // const timerComponents = useEpochTimeLeft(isLoading ? 0 : queryResp[0].data?.unstakeInfo)
  const withdrawMutation = useWithdrawFromDelegator();
  const [withdrawValue, setWithdrawValue] = useState("");
  const pool = queryResp[0].data as DelegatorInfo;

  return (
    <Stack
      justify="space-between"
      px={8}
      py={8}
      boxShadow="lg"
      rounded="3xl"
      bg="secondary.400"
      bgGradient="linear(to-b, secondary.400, secondary.300)"
      color="white"
    >
      <Box>
        <HStack mb={3}>
          <Text fontWeight="700" fontSize="2xl">
            Claim your ONE
          </Text>
        </HStack>

        {/* pool details */}
        <Stack mb={3} spacing={{ base: 3, md: 2 }}>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              APR
            </Text>

            <Skeleton isLoaded={!isLoading}>
              <Box display="flex" alignItems="center">
                {pool?.apr && (
                  <PlutusAPRCalculator
                    apr={pool?.apr}
                    tokenSymbol={"ONE"}
                    tokenLink={
                      "https://staking.harmony.one/validators/mainnet/one1ac8yehqexdnam9yza4q4y3zwrkyhrf4hqcpqy5"
                    }
                  />
                )}
                <Text fontWeight="700" fontSize="sm">
                  {pool?.apr
                    ? `${displayNumber(
                        Math.round(pool?.apr.yearlyAPR)
                      )}%`
                    : "N/A"}
                </Text>
              </Box>
            </Skeleton>
          </Stack>
          <Stack direction={["column", "row"]} justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              Balance of sONE
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
                    ? (pool?.unstakeInfo?.hours + "h " +
                      pool?.unstakeInfo?.minutes + "min " +
                      pool?.unstakeInfo?.seconds + "s")
                    : "Withdraw avaliable"}
                </Text>
              ) : (
                <Text fontWeight="700" fontSize="sm">
                  Need to unstake first
                </Text>
              )}
            </Skeleton>
          </Stack>
        </Stack>
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
                onClick={() => withdrawMutation.mutate({
                  address: pool?.address,
                  amount: withdrawValue
                })}
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
          <Stack
            spacing={10}
            direction={["column-reverse", "row"]}
            align="flex-start"
            justify="space-between"
          >
            <Stack spacing={5} flex={1}>
              <Stack
                justify={"center"}
                align={"baseline"}
                direction={["column", "row"]}
                spacing={10}
              >
                <DepositCard />
                <UnstakeCard />
              </Stack>
              <WithdrawCard />
            </Stack>
            <Stack flex={1} mb={3} spacing={12}>
              <Stack>
                <Heading fontSize="3xl">How it works</Heading>
              </Stack>
              <Stack>
                <Text fontSize="sm">
                  1. Delegate to Hermes DeFi Node staking your ONE in the first
                  card. (Minimum deposit = 100 ONEs)
                </Text>

                <Text fontSize="sm">
                  2. You can stake your share into the sONE pool in the pools
                  section and win PLTS.
                </Text>

                {/* <Text fontSize="sm">
                  3. Waiting room. Ongoing (<Link href="app/waiting-room">here</Link>)
                </Text> */}
                <Text fontSize="sm">
                  3. In case that you want to withdraw your staked ONE:
                </Text>

                <Text fontSize="sm" pl={"5"}>
                  3.1. Withdraw your sONE from the pool.
                </Text>

                <Text fontSize="sm" pl={"5"}>
                  3.2 Set the amount of ONE that you want back and click into
                  the unstake button.
                </Text>

                <Text fontSize="sm" pl={"5"}>
                  3.3 Wait until the next epoch to withdraw your staked + reward
                  ONE.
                </Text>
              </Stack>

              <Text fontSize="sm">
                For more details visit, see our doc:{" "}
                <Link
                  isExternal
                  color="blue.600"
                  href="https://hermes-defi.gitbook.io/the-hermes-protocol/"
                >
                  https://hermes-defi.gitbook.io/the-hermes-protocol/
                </Link>
              </Text>
              <Stack>
                <Text fontSize="sm">
                  <b>Disclaimer:</b> Thats a beta version. Use carefully at your
                  own risk.
                </Text>
                <Text fontSize="sm">
                  Final version will be deployed at Hermes Protocol launch, with
                  a full <b>CertiK audition</b>.
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

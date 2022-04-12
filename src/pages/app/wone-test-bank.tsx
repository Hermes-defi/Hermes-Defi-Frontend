import React from "react";
import BigNumber from "bignumber.js";
import defaultTokens from "config/tokens";
import {
  Badge,
  Button,
  Container,
  chakra,
  Divider,
  Heading,
  Image,
  Input,
  Stack,
  StackDivider,
  Text,
  Skeleton,
  Tooltip,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Link,
  color,
} from "@chakra-ui/react";
import { AppLayout } from "components/layout";
import {
  useApproveDepositToken,
  useDepositTokenInBank,
  useFetchGeneralInfo,
  useHasApprovedDepositToken,
  useUserInfo,
  useWithdrawLpFromBank,
} from "state/wone-test-bank";
import { displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";
import { useTokenBalance } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";

const WoneBank = () => {
  const { account } = useActiveWeb3React();
  const generalInfo = useFetchGeneralInfo();

  const userInfo = useUserInfo();
  const lpBalance = useTokenBalance(generalInfo?.data?.rewardToken?.address, generalInfo?.data?.rewardToken?.decimals);
  const woneBalance = useTokenBalance(defaultTokens.wone.address, defaultTokens.wone.decimals);
  const hasApprovedWone = useHasApprovedDepositToken();

  const approveWone = useApproveDepositToken();
  const depositWone = useDepositTokenInBank();
  const harvestWone = useDepositTokenInBank();
  const withdrawLp = useWithdrawLpFromBank();

  const [depositAmount, setDepositAmount] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");

  return (
    <AppLayout>
      <Container maxW="lg" centerContent pt={5}>
        <chakra.div textAlign="center">
          <Heading bgGradient="linear(to-l, #f6c770, #8400FF)" bgClip="text">
            Hermes WONE TEST Bank
          </Heading>
          <Text>Withdraw your funds from here</Text>
          <Text>Then break the LP in ViperSwap</Text>
          <Link
            href={`https://hermes-defi.gitbook.io/the-hermes-protocol/hermes-products/wone-bank`}
            isExternal
            fontWeight="700"
            fontSize="sm"
            textDecoration={"underline"}
          >
            More info in our docs
          </Link>
        </chakra.div>

        <chakra.div
          mt={10}
          px={8}
          py={4}
          bg="accent.500"
          boxShadow="base"
          bgGradient="linear(to-b, #8400FF, #5CB4FF)"
          rounded="3xl"
          color="white"
          w="full"
        >
          {/* bank name */}
          <Stack direction={{ base: "column", md: "row" }} align="center" mb={5} spacing={2} justify="space-between">
            <Stack direction="row" alignItems="center" spacing={3}>
              <Image alt="won" border="2px" borderColor="white" bg="white" rounded="full" src="/harmony-one-logo.png" boxSize={12} />
              <Heading fontSize="3xl">WONE</Heading>
            </Stack>
            <Badge boxShadow="md" px={2} rounded="lg" colorScheme="white" fontSize={["xs", "sm"]} backgroundColor={"purple"}>
              Don't trade this token
            </Badge>
          </Stack>

          {/* bank details */}
          <Stack spacing={1} mt={10} mb={5}>
            <Stack direction="row" alignItems="center" justify="space-between">
              <Heading fontSize="xl">Earn</Heading>

              <Heading fontSize="2xl">FAKE PLTS</Heading>
            </Stack>

            <Stack direction="row" alignItems="center" justify="space-between">
              <Heading fontSize="xl">APR</Heading>

              <Skeleton isLoaded={!generalInfo.isLoading}>
                <Heading fontSize="2xl">
                  {generalInfo.data?.apr?.yearlyAPR ? `${displayNumber(generalInfo.data?.apr?.yearlyAPR, true, 2)}%` : "N/A"}
                </Heading>
              </Skeleton>
            </Stack>

            <Stack direction="row" alignItems="center" justify="space-between">
              <Heading fontSize="xl">Daily APR</Heading>

              <Skeleton isLoaded={!generalInfo.isLoading}>
                <Heading fontSize="2xl">
                  {generalInfo.data?.apr?.dailyAPR ? `${displayNumber(generalInfo.data?.apr?.dailyAPR, true, 2)}%` : "N/A"}
                </Heading>
              </Skeleton>
            </Stack>

            <Stack direction="row" alignItems="center" justify="space-between">
              <Heading fontSize="xl">Total WONE Staked</Heading>

              <Skeleton isLoaded={!generalInfo.isLoading}>
                <Tooltip label={generalInfo.data?.totalStaked ? displayNumber(generalInfo.data?.totalStaked, true, 2) : "N/A"}>
                  <Heading fontSize="2xl">
                    {generalInfo.data?.totalStaked
                      ? displayCurrency(new BigNumber(generalInfo.data?.totalStaked).times(generalInfo.data?.wonePrice || 0).toNumber())
                      : "N/A"}
                  </Heading>
                </Tooltip>
              </Skeleton>
            </Stack>
          </Stack>

          {/* user details */}
          {account && (
            <>
              <Divider />

              <Stack spacing={1} my={5}>
                <Stack direction="row" alignItems="center" justify="space-between">
                  <Heading fontSize="xl">My WONE/HRMS LP</Heading>

                  <Heading fontSize="2xl">{displayNumber(lpBalance || 0, true, 2)}</Heading>
                </Stack>

                <Stack direction="row" alignItems="center" justify="space-between">
                  <Heading fontSize="xl">My PLTS Rewards</Heading>

                  <Skeleton isLoaded={!userInfo.isLoading}>
                    <Heading fontSize="2xl">{displayTokenCurrency(userInfo.data?.pendingReward || 0, "PLTS")}</Heading>
                  </Skeleton>
                </Stack>
              </Stack>
            </>
          )}

          {/* deposit/withdraw */}
          <Divider />
          <Tabs my={5} variant="solid-rounded">
            <TabList>
              <Tab
                isDisabled={generalInfo.data?.withdrawLocked}
                px={6}
                py={1.5}
                rounded={16}
                color="white"
                _selected={{ bg: "whiteAlpha.400" }}
                _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
              >
                Withdraw
              </Tab>
            </TabList>

            <TabPanels>
              {/* withdraw panel */}
              <TabPanel px={0}>
                <Stack spacing={1}>
                  <chakra.div textAlign="right">
                    <Button
                      onClick={() => setWithdrawAmount(userInfo.data?.stakedShares || "")}
                      color="white"
                      mb={2}
                      variant="link"
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Staked Shares: {displayNumber(userInfo.data?.stakedShares || 0, true, 2)}
                    </Button>
                  </chakra.div>

                  <Stack
                    spacing={0}
                    borderWidth="1px"
                    borderColor="rgb(255 255 255 / 35%)"
                    p={1}
                    py={2}
                    rounded="xl"
                    direction="row"
                    align="center"
                  >
                    <Input
                      flex={1.5}
                      w="full"
                      border="0px"
                      fontWeight="600"
                      fontSize="lg"
                      _focus={{ outline: "none" }}
                      _placeholder={{ color: "rgb(255 255 255 / 65%)" }}
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      focusBorderColor="secondary.500"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      max={userInfo.data?.stakedShares}
                      isDisabled={userInfo.isLoading}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      value={withdrawAmount}
                    />
                  </Stack>

                  <Stack direction="row" alignItems="center" textAlign="center" spacing={4} pt={5}>
                    <Button
                      isFullWidth
                      variant="solid"
                      size="lg"
                      fontSize="md"
                      bg="gray.700"
                      boxShadow="lg"
                      rounded="16px"
                      isDisabled={generalInfo.data?.withdrawLocked}
                      isLoading={withdrawLp.isLoading}
                      onClick={() => withdrawLp.mutate({ amount: withdrawAmount })}
                      _hover={{ bg: "gray.600" }}
                      _focus={{ bg: "gray.500" }}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </chakra.div>
      </Container>
    </AppLayout>
  );
};

export default WoneBank;

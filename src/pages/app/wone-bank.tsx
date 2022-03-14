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
} from "@chakra-ui/react";
import { AppLayout } from "components/layout";
import {
  useApproveDepositToken,
  useDepositTokenInBank,
  useFetchGeneralInfo,
  useHasApprovedDepositToken,
  useUserInfo,
  useWithdrawLpFromBank,
} from "state/wone-bank";
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
            Hermes WONE Bank
          </Heading>
          <Text>Use your WONE to purchase HRMS/ONE LPs and earn PLTS</Text>
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
          </Stack>

          {/* bank details */}
          <Stack spacing={1} mt={10} mb={5}>
            <Stack direction="row" alignItems="center" justify="space-between">
              <Heading fontSize="xl">Earn</Heading>

              <Heading fontSize="2xl">PLTS</Heading>
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
                    {displayCurrency(new BigNumber(generalInfo.data?.totalStaked).times(generalInfo.data?.wonePrice || 0).toNumber())}
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
                  <Heading fontSize="xl">My Staked Shares</Heading>

                  <Skeleton isLoaded={!userInfo.isLoading}>
                    <Heading fontSize="2xl">{displayNumber(userInfo.data?.stakedShares || 0, true, 2)}</Heading>
                  </Skeleton>
                </Stack>

                <Stack direction="row" alignItems="center" justify="space-between">
                  <Heading fontSize="xl">My PLTS Rewards</Heading>

                  <Skeleton isLoaded={!userInfo.isLoading}>
                    <Heading fontSize="2xl">{displayTokenCurrency(userInfo.data?.pendingReward || 0, "PLTS")}</Heading>
                  </Skeleton>
                </Stack>

                <Stack direction="row" alignItems="center" textAlign="center" spacing={4} pt={2}>
                  <Button
                    isFullWidth
                    variant="solid"
                    size="md"
                    bg="gray.700"
                    boxShadow="lg"
                    rounded="16px"
                    isDisabled={userInfo.isLoading || Number(userInfo.data?.pendingReward) <= 0}
                    isLoading={harvestWone.isLoading}
                    onClick={() => harvestWone.mutate({ amount: "0" })}
                    _hover={{ bg: "gray.600" }}
                    _focus={{ bg: "gray.500" }}
                  >
                    Claim rewards
                  </Button>
                </Stack>
              </Stack>
            </>
          )}

          {/* deposit/withdraw */}
          <Divider />
          <Tabs my={5} variant="solid-rounded">
            <TabList>
              <Tab
                isDisabled={generalInfo.data?.withdrawLocked === false}
                px={6}
                py={1.5}
                rounded={16}
                color="white"
                _selected={{ bg: "whiteAlpha.400" }}
                _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
              >
                Deposit
              </Tab>
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
              {/* deposit panel */}
              <TabPanel px={0}>
                <Stack spacing={1}>
                  <chakra.div textAlign="right">
                    <Button
                      onClick={() => setDepositAmount(woneBalance || "")}
                      color="white"
                      mb={2}
                      variant="link"
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Balance: {woneBalance || "0"} WONE
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
                    divider={<StackDivider alignSelf="center" h="70%" borderColor="rgb(255 255 255 / 15%)" />}
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
                      max={woneBalance}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      value={depositAmount}
                    />

                    {/* <Select
                  fontSize="xs"
                  size="sm"
                  flex={1}
                  border="0px"
                  _focus={{ outline: "none" }}
                  // value={depositTokenAddress}
                  // onChange={(e) => setDepositTokenAddress(e.target.value)}
                >
                  {["WONE", "ONE"].map((token) => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </Select> */}
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
                      isDisabled={hasApprovedWone.isLoading || hasApprovedWone.data}
                      isLoading={approveWone.isLoading}
                      onClick={() => approveWone.mutate()}
                      _hover={{ bg: "gray.600" }}
                      _focus={{ bg: "gray.500" }}
                    >
                      Approve
                    </Button>

                    <Button
                      isFullWidth
                      variant="solid"
                      size="lg"
                      bg="gray.700"
                      boxShadow="lg"
                      rounded="16px"
                      isDisabled={!hasApprovedWone.data}
                      isLoading={depositWone.isLoading}
                      onClick={() => depositWone.mutate({ amount: depositAmount })}
                      _hover={{ bg: "gray.600" }}
                      _focus={{ bg: "gray.500" }}
                    >
                      Deposit
                    </Button>
                  </Stack>
                </Stack>
              </TabPanel>

              {/* withdraw panel */}
              <TabPanel px={0}>
                <Stack spacing={1}>
                  <chakra.div textAlign="right">
                    <Button
                      onClick={() => setWithdrawAmount(lpBalance || "")}
                      color="white"
                      mb={2}
                      variant="link"
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      LP Balance: {lpBalance || "0"} WONE/HRMS
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
                      max={lpBalance}
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

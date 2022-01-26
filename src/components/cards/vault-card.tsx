import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Vault } from "config/vaults";

import {
  useApproveVault,
  useApproveVaultZap,
  useDepositIntoVault,
  useDepositAllIntoVault,
  useWithdrawFromVault,
  useWithdrawAllFromVault,
} from "state/vaults";

import {
  Box,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  Link,
  Badge,
  useDisclosure,
  Collapse,
  Divider,
  Tooltip,
  Button,
  StackDivider,
  Input,
  Select,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import { WRAPPED_NATIVE_TOKEN_ADDRESS } from "config/constants";
import { displayCurrency, displayNumber, displayTokenCurrencyDecimals } from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { useTokenBalance } from "hooks/wallet";

export const VaultCard: React.FC<{ vault: Vault }> = ({ vault }) => {
  const lpLink = {
    quickswap: `https://quickswap.exchange/#/add/${vault.pairs[0].address}/${vault.pairs[1].address}`,
    dfyn: `https://info.dfyn.network/pair/${vault.stakeToken.address}`,
    sushiswap: `https://app.sushi.com/add/${vault.pairs[0].address}/${vault.pairs[1].address}`,
  };

  const { account } = useActiveWeb3React();
  const { isOpen, onToggle } = useDisclosure();

  const [depositTokenAddress, setDepositTokenAddress] = useState(vault.stakeToken.address);
  const [depositValue, setDepositValue] = useState("");

  const [withdrawTokenAddress, setWithdrawTokenAddress] = useState(vault.stakeToken.address);
  const [withdrawValue, setWithdrawValue] = useState("");

  const approveMutation = useApproveVault();
  const approveZapMutation = useApproveVaultZap();

  const depositMutation = useDepositIntoVault();
  const depositAllMutation = useDepositAllIntoVault();

  const withdrawMutation = useWithdrawFromVault();
  const withdrawAllMutation = useWithdrawAllFromVault();

  // get tokens for zap
  let tokens = [vault.stakeToken, ...vault.pairs];
  const hasNativeHrc20 = tokens.find((token) => token.address === WRAPPED_NATIVE_TOKEN_ADDRESS);
  if (hasNativeHrc20) {
    tokens = tokens.concat({ address: "native", decimals: 18, symbol: "ONE" });
  }

  const depositToken = tokens.find((token) => token.address === depositTokenAddress);
  const withdrawToken = tokens.find((token) => token.address === withdrawTokenAddress);

  // get balances
  const mainBalance = useTokenBalance(vault.stakeToken.address);
  let balance = useTokenBalance(depositToken.address, depositToken.decimals);

  const depositPercentage =
    new BigNumber(depositValue || "0")
      .div(balance || "0")
      .times(100)
      .toNumber() || 0;

  const withdrawPercentage =
    new BigNumber(withdrawValue || "0")
      .div(vault.userTotalStaked || "0")
      .times(100)
      .toNumber() || 0;

  return (
    <Box
      py={4}
      px={3}
      w={["20rem", "30rem", "100%", "60rem", "70rem"]}
      bg="accent.500"
      boxShadow="rgb(84 158 171 / 65%) 0px 25px 50px -12px"
      bgGradient={`linear(to-b, primary.500, secondary.300)`}
      rounded="3xl"
      color="white"
    >
      <Stack px={{ base: 6, md: 12 }} direction={{ base: "column", md: "row" }} my={4} align="center" onClick={onToggle}>
        <Stack align="center" spacing={2}>
          <Box w={12} h={12} pos="relative">
            <Image pos="absolute" top="5px" left="0" rounded="12px" src={vault.stakeToken.logo[0]} boxSize={6} />
            <Image pos="absolute" bottom="-5px" right="0px" rounded="20px" src={vault.stakeToken.logo[1]} boxSize={10} />
          </Box>

          <Heading fontSize="3xl">{vault.stakeToken.symbol}</Heading>

          <HStack>
            {vault.amm && (
              <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
                {vault.amm}
              </Badge>
            )}

            <Tooltip
              placement="bottom"
              label={`Deposit fee ${vault.depositFees}%\n\nWithdrawal fee ${vault.withdrawFees}%\n\nPerfomance fee ${
                vault.performanceFee * 100
              }%
            `}
              fontSize="xs"
              textAlign="center"
              width="32"
              rounded="lg"
              px={2}
            >
              <Badge boxShadow="md" px={2} rounded="lg" bg={"gray.700"} _hover={{ bg: "gray.600" }} color="white" w="14">
                Fees
              </Badge>
            </Tooltip>
          </HStack>
        </Stack>

        <Stack
          flex={1}
          spacing={{ base: 4, md: 1 }}
          pl={{ base: 0, md: 20 }}
          pt={{ base: 10, md: 0 }}
          align={{ base: "flex-end", md: "flex-end" }}
          direction={{ base: "row", md: "row" }}
          flexWrap="wrap"
          flexBasis="50%"
          justify="space-between"
        >
          <Stack py={{ base: 5, md: 0 }} spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Text fontSize="sm">{displayCurrency(new BigNumber(mainBalance).times(vault.stakeToken.price || 0).toNumber())}</Text>
            <Text fontWeight="700" fontSize="lg">
              {mainBalance ? displayTokenCurrencyDecimals(mainBalance, "", true, 8) : "N/A"}
            </Text>
            <Text>Wallet</Text>
          </Stack>

          <Stack py={{ base: 5, md: 0 }} spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Text fontSize="sm">
              {displayCurrency(new BigNumber(vault.userTotalStaked || 0).times(vault.stakeToken.price || 0).toNumber())}
            </Text>

            <Text fontWeight="700" fontSize="lg">
              {vault.userTotalStaked ? displayTokenCurrencyDecimals(vault.userTotalStaked, "", true, 8) : "N/A"}
            </Text>

            <Text>Staked</Text>
          </Stack>

          <Stack py={{ base: 5, md: 0 }} spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy ? `${displayNumber(vault.apy.yearly, true)}%` : "N/A"}
            </Text>
            <Text>APY</Text>
          </Stack>

          <Stack py={{ base: 5, md: 0 }} spacing={0} direction="column" alignItems="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy ? `${displayNumber(vault.apy.daily, false, 6)}%` : "N/A"}
            </Text>
            <Text>Daily</Text>
          </Stack>

          <Stack py={{ base: 5, md: 0 }} spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.totalStaked ? displayCurrency(new BigNumber(vault.totalStaked).times(vault.stakeToken.price || 0).toNumber()) : "N/A"}
            </Text>
            <Text>Total Liquidity</Text>
          </Stack>
        </Stack>
      </Stack>

      <Collapse in={isOpen} animateOpacity>
        <Divider borderColor="gray.200" my={7} />

        <Stack mb={10} px={{ base: 3, md: 14 }}>
          <Stack spacing={{ base: 10, md: "7rem" }} direction={{ base: "column", md: "row" }} justify="space-between">
            {/* deposit section */}
            <Stack spacing="2" flex={1}>
              <HStack align="center">
                <Text fontWeight="400" fontSize="sm">
                  Balance:
                </Text>

                <Button onClick={() => setDepositValue(balance || "")} colorScheme="white" variant="link">
                  <Text fontWeight="600" fontSize={["xs", "sm"]}>
                    {balance ? displayTokenCurrencyDecimals(balance, depositToken.symbol, true, 8) : "N/A"}
                  </Text>
                </Button>
              </HStack>

              <Stack>
                <Stack
                  spacing={0}
                  borderWidth="1px"
                  borderColor="rgb(255 255 255 / 35%)"
                  p={1}
                  rounded="xl"
                  direction="row"
                  align="center"
                  divider={<StackDivider alignSelf="center" h="70%" borderColor="rgb(255 255 255 / 15%)" />}
                >
                  <Input
                    flex={1.5}
                    isDisabled={!balance}
                    _focus={{ outline: "none" }}
                    border="0px"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    focusBorderColor="secondary.500"
                    placeholder="0.00"
                    min="0"
                    max={balance}
                    type="number"
                    onChange={(e) => setDepositValue(e.target.value)}
                    value={depositValue}
                  />

                  {!!vault.zapAddress && (
                    <Select
                      fontSize="xs"
                      size="sm"
                      flex={1}
                      border="0px"
                      _focus={{ outline: "none" }}
                      value={depositTokenAddress}
                      onChange={(e) => setDepositTokenAddress(e.target.value)}
                    >
                      {tokens.map((token) => (
                        <option key={token.address} value={token.address}>
                          {token.symbol}
                        </option>
                      ))}
                    </Select>
                  )}
                </Stack>

                <Slider
                  h="3rem"
                  aria-label="deposit-slider"
                  defaultValue={0}
                  min={0}
                  max={100}
                  focusThumbOnChange={false}
                  value={depositPercentage || 0}
                  onChange={(depositPercentage) => {
                    setDepositValue(new BigNumber(balance).times(depositPercentage).div(100).toString());
                  }}
                >
                  <SliderMark value={0} mt="9" fontSize="xx-small">
                    0%
                  </SliderMark>
                  <SliderMark value={25} mt="9" fontSize="xx-small">
                    25%
                  </SliderMark>
                  <SliderMark value={50} mt="9" fontSize="xx-small">
                    50%
                  </SliderMark>
                  <SliderMark value={75} mt="9" fontSize="xx-small">
                    75%
                  </SliderMark>
                  <SliderMark value={100} mt="9" ml="-2" fontSize="xx-small">
                    100%
                  </SliderMark>

                  <SliderTrack boxSize="1.5" bg="pink.100">
                    <SliderFilledTrack bgGradient={`linear(to-l,green.500, green.100)`} />
                  </SliderTrack>

                  <Tooltip hasArrow bg="blue.400" color="white" placement="top" label={`${depositPercentage || 0}%`}>
                    <SliderThumb boxSize={4} />
                  </Tooltip>
                </Slider>
              </Stack>

              <Stack w="100%" spacing={8} pt={7} direction="row" align="center" justify="center">
                {!vault.approvedTokens?.includes(depositTokenAddress) && (
                  <Button
                    size="md"
                    isLoading={approveMutation.isLoading}
                    onClick={() => approveMutation.mutate({ address: vault.address, tokenAddress: depositTokenAddress })}
                    bg="gray.700"
                    boxShadow="lg"
                    _hover={{ bg: "gray.600" }}
                    w={["36", "48"]}
                  >
                    Approve
                  </Button>
                )}

                {vault.approvedTokens?.includes(depositTokenAddress) && (
                  <>
                    <Button
                      isDisabled={balance === "0" || balance === undefined}
                      isLoading={depositMutation.isLoading}
                      onClick={() => {
                        depositMutation
                          .mutateAsync({
                            id: vault.address,
                            amount: depositValue,
                            tokenAddress: depositTokenAddress,
                          })
                          .then(() => setDepositValue(""));
                      }}
                      size="md"
                      bg={"gray.700"}
                      w={["36", "48"]}
                      _hover={{ bg: "gray.600" }}
                    >
                      Stake
                    </Button>

                    <Button
                      isDisabled={balance === "0" || balance === undefined}
                      isLoading={depositAllMutation.isLoading}
                      onClick={() => {
                        depositAllMutation
                          .mutateAsync({
                            id: vault.address,
                            tokenAddress: depositTokenAddress,
                          })
                          .then(() => setDepositValue(""));
                      }}
                      size="md"
                      bg={"gray.700"}
                      w={["36", "48"]}
                      _hover={{ bg: "gray.600" }}
                    >
                      Stake All
                    </Button>
                  </>
                )}
              </Stack>

              <Stack spacing={3} pt={10} align="center" justify="center">
                {account && (
                  <Text fontWeight="thin" fontSize="sm" align="center" w={["100%", "100%", "md"]} ml={[null, null, "-8", "-8", null, "-8"]}>
                    You will receive {vault.rewardToken.symbol} token as a receipt for your deposited {vault.stakeToken.symbol} assets. This
                    token is needed to withdraw your {vault.stakeToken.symbol}!
                  </Text>
                )}

                <Link href={lpLink[vault.amm]} isExternal fontWeight="700" fontSize="sm" textDecoration="underline">
                  Add liquidity in {vault.amm.toUpperCase()}
                </Link>
              </Stack>
            </Stack>

            {/* withdraw section */}
            <Stack spacing="2" flex={1}>
              <HStack align="center">
                <Text fontWeight="400" fontSize="sm">
                  Staked:
                </Text>

                <Button
                  onClick={() => setWithdrawValue(parseFloat(vault.userTotalStaked).toFixed(18) || "")}
                  colorScheme="white"
                  variant="link"
                >
                  <Text fontWeight="600" fontSize={["xs", "sm"]}>
                    {vault.userTotalStaked ? displayTokenCurrencyDecimals(vault.userTotalStaked, vault.stakeToken.symbol, false, 8) : "N/A"}
                  </Text>
                </Button>
              </HStack>

              <Stack>
                <Stack
                  spacing={0}
                  borderWidth="1px"
                  borderColor="rgb(255 255 255 / 35%)"
                  p={1}
                  rounded="xl"
                  direction="row"
                  align="center"
                  divider={<StackDivider alignSelf="center" h="70%" borderColor="rgb(255 255 255 / 15%)" />}
                >
                  <Input
                    flex={1.5}
                    isDisabled={!balance}
                    _focus={{ outline: "none" }}
                    border="0px"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    focusBorderColor="secondary.500"
                    placeholder="0.00"
                    min="0"
                    max={vault.userTotalStaked}
                    type="number"
                    onChange={(e) => setWithdrawValue(e.target.value)}
                    value={withdrawValue}
                  />

                  {!!vault.zapAddress && (
                    <Select
                      fontSize="xs"
                      size="sm"
                      flex={1}
                      border="0px"
                      _focus={{ outline: "none" }}
                      value={withdrawTokenAddress}
                      onChange={(e) => setWithdrawTokenAddress(e.target.value)}
                    >
                      {tokens.map((token) => (
                        <option key={token.address} value={token.address}>
                          {token.symbol}
                        </option>
                      ))}
                    </Select>
                  )}
                </Stack>

                <Slider
                  h="3rem"
                  aria-label="deposit-slider"
                  defaultValue={0}
                  min={0}
                  max={100}
                  focusThumbOnChange={false}
                  value={withdrawPercentage || 0}
                  onChange={(withdrawPercentage) => {
                    setWithdrawValue(new BigNumber(vault.userTotalStaked).times(withdrawPercentage).div(100).toString());
                  }}
                >
                  <SliderMark value={0} mt="9" fontSize="xx-small">
                    0%
                  </SliderMark>
                  <SliderMark value={25} mt="9" fontSize="xx-small">
                    25%
                  </SliderMark>
                  <SliderMark value={50} mt="9" fontSize="xx-small">
                    50%
                  </SliderMark>
                  <SliderMark value={75} mt="9" fontSize="xx-small">
                    75%
                  </SliderMark>
                  <SliderMark value={100} mt="9" ml="-2" fontSize="xx-small">
                    100%
                  </SliderMark>

                  <SliderTrack boxSize="1.5" bg="pink.100">
                    <SliderFilledTrack bgGradient={`linear(to-l,green.500, green.100)`} />
                  </SliderTrack>

                  <Tooltip hasArrow bg="blue.400" color="white" placement="top" label={`${displayNumber(withdrawPercentage || 0)}%`}>
                    <SliderThumb boxSize={4} />
                  </Tooltip>
                </Slider>
              </Stack>

              <Stack w="100%" spacing={8} pt={7} direction="row" align="center" justify="center">
                {withdrawTokenAddress !== vault.stakeToken.address && !vault.hasApprovedZap && (
                  <Button
                    size="md"
                    isLoading={approveZapMutation.isLoading}
                    onClick={() => approveZapMutation.mutate({ address: vault.address })}
                    bg="gray.700"
                    boxShadow="lg"
                    _hover={{ bg: "gray.600" }}
                    w={["36", "48"]}
                  >
                    Approve
                  </Button>
                )}

                {(vault.stakeToken.address === withdrawTokenAddress || vault.hasApprovedZap) && (
                  <>
                    <Button
                      isDisabled={balance === "0" || balance === undefined}
                      isLoading={withdrawMutation.isLoading}
                      onClick={() => {
                        withdrawMutation
                          .mutateAsync({
                            id: vault.address,
                            amount: withdrawValue,
                            tokenAddress: withdrawTokenAddress,
                          })
                          .then(() => setWithdrawValue(""));
                      }}
                      size="md"
                      bg={"gray.700"}
                      w={["36", "48"]}
                      _hover={{ bg: "gray.600" }}
                    >
                      Withdraw
                    </Button>

                    <Button
                      isDisabled={balance === "0" || balance === undefined}
                      isLoading={withdrawAllMutation.isLoading}
                      onClick={() => {
                        withdrawAllMutation
                          .mutateAsync({
                            id: vault.address,
                            tokenAddress: withdrawTokenAddress,
                          })
                          .then(() => setWithdrawValue(""));
                      }}
                      size="md"
                      bg={"gray.700"}
                      w={["36", "48"]}
                      _hover={{ bg: "gray.600" }}
                    >
                      Withdraw All
                    </Button>
                  </>
                )}
              </Stack>

              <Stack spacing={3} pt={10} align="center">
                {account && (
                  <Text fontWeight="thin" fontSize="sm" align="center" w={["100%", "100%", "md"]} ml={[null, null, "-8", "-8", null, "-8"]}>
                    Withdrawal will result in:
                    <br />
                    Redeem {vault.rewardToken.symbol} token for {vault.stakeToken.symbol}
                  </Text>
                )}

                <Link
                  href={`https://explorer.harmony.one/address/${vault.address}`}
                  textDecoration="underline"
                  fontWeight="700"
                  fontSize="sm"
                >
                  View on Harmony
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
};

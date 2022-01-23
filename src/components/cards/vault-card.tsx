import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Vault } from "config/vaults";

import { useApproveVault, useDepositIntoVault, useWithdrawAllFromVault, useWithdrawFromVault } from "state/vaults";

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

  const approveMutation = useApproveVault();
  const depositMutation = useDepositIntoVault();
  const depositAllMutation = useDepositIntoVault();

  const withdrawMutation = useWithdrawFromVault();
  const withdrawAllMutation = useWithdrawAllFromVault();

  // get tokens for zap
  let tokens = [vault.stakeToken, ...vault.pairs];
  const hasNativeHrc20 = tokens.find((token) => token.address === WRAPPED_NATIVE_TOKEN_ADDRESS);
  if (hasNativeHrc20) {
    tokens = tokens.concat({ address: "native", decimals: 18, symbol: "ONE" });
  }

  const depositToken = tokens.find((token) => token.address === depositTokenAddress);

  // get balances
  const mainBalance = useTokenBalance(vault.stakeToken.address);
  let balance = useTokenBalance(depositToken.address, depositToken.decimals);

  const depositPercentage =
    new BigNumber(depositValue || "0")
      .div(balance || "0")
      .times(100)
      .toNumber() || 0;

  return (
    <Box
      px={16}
      py={4}
      w={["20rem", "30rem", "100%", "60rem", "70rem"]}
      bg="accent.500"
      boxShadow="rgb(84 158 171 / 65%) 0px 25px 50px -12px"
      bgGradient={`linear(to-b, primary.500, secondary.300)`}
      rounded="3xl"
      color="white"
    >
      <Stack direction={["column", "column", "row"]} my={4} align="center" onClick={onToggle}>
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

        <Stack flex={1} pl={20} align="flex-end" direction="row" justify="space-between">
          <Stack spacing={0} direction={["row", "row", "column"]} alignItems="center" justifyContent="center">
            <Text fontSize="sm">{displayCurrency(new BigNumber(mainBalance).times(vault.stakeToken.price || 0).toNumber())}</Text>
            <Text fontWeight="700" fontSize="lg">
              {mainBalance ? displayTokenCurrencyDecimals(mainBalance, "", true, 8) : "N/A"}
            </Text>
            <Text>Wallet</Text>
          </Stack>

          <Stack spacing={0} direction={["row", "row", "column"]} alignItems="center" justifyContent="center">
            <Text fontSize="sm">
              {displayCurrency(new BigNumber(vault.userTotalStaked || 0).times(vault.stakeToken.price || 0).toNumber())}
            </Text>

            <Text fontWeight="700" fontSize="lg">
              {vault.userTotalStaked ? displayTokenCurrencyDecimals(vault.userTotalStaked, "", true, 8) : "N/A"}
            </Text>

            <Text>Staked</Text>
          </Stack>

          <Stack spacing={0} direction={["row", "row", "column"]} alignItems="center" justifyContent="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy ? `${displayNumber(vault.apy.yearly, true)}%` : "N/A"}
            </Text>
            <Text>APY</Text>
          </Stack>

          <Stack spacing={0} direction={["row", "row", "column"]} alignItems="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy ? `${displayNumber(vault.apy.daily, false, 6)}%` : "N/A"}
            </Text>
            <Text>Daily</Text>
          </Stack>

          <Stack spacing={0} direction={["row", "row", "column"]} alignItems="center" justifyContent={"center"}>
            <Text fontWeight="700" fontSize="lg">
              {vault.totalStaked ? displayCurrency(new BigNumber(vault.totalStaked).times(vault.stakeToken.price || 0).toNumber()) : "N/A"}
            </Text>
            <Text>Total Liquidity</Text>
          </Stack>
        </Stack>
      </Stack>

      <Collapse in={isOpen} animateOpacity>
        <Divider borderColor="gray.200" my={7} />

        <Stack mb={8}>
          <Stack direction={["column", "column", "row"]} justify="space-between">
            {/* deposit section */}
            <Box>
              <HStack align="center" mb={1}>
                <Text fontWeight="400" fontSize="sm">
                  Balance:
                </Text>

                <Button onClick={() => setDepositValue(balance || "")} colorScheme="white" variant="link">
                  <Text fontWeight="600" fontSize={["xs", "sm"]}>
                    {balance ? displayTokenCurrencyDecimals(balance, depositToken.symbol, true, 8) : "N/A"}
                  </Text>
                </Button>
              </HStack>

              <Stack h="7rem" w={["100%", "100%", "sm"]}>
                <Stack
                  mt={2}
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
                </Stack>

                <Slider
                  aria-label="deposit-slider"
                  defaultValue={0}
                  min={0}
                  max={100}
                  value={depositPercentage || 0}
                  onChange={(depositPercentage) => {
                    setDepositValue(new BigNumber(balance).times(depositPercentage).div(100).toString());
                  }}
                >
                  <SliderMark value={0} mt="7" fontSize="xx-small">
                    0%
                  </SliderMark>
                  <SliderMark value={25} mt="7" fontSize="xx-small">
                    25%
                  </SliderMark>
                  <SliderMark value={50} mt="7" fontSize="xx-small">
                    50%
                  </SliderMark>
                  <SliderMark value={75} mt="7" fontSize="xx-small">
                    75%
                  </SliderMark>
                  <SliderMark value={100} mt="7" fontSize="xx-small">
                    100%
                  </SliderMark>

                  <SliderTrack mt={5} boxSize="1.5" bg="pink.100">
                    <SliderFilledTrack bgGradient={`linear(to-l,green.500, green.100)`} />
                  </SliderTrack>

                  <Tooltip hasArrow bg="blue.400" color="white" placement="top" label={`${depositPercentage || 0}%`}>
                    <SliderThumb mt={5} boxSize={4} />
                  </Tooltip>
                </Slider>
              </Stack>

              <Stack align="center" justify="space-between" mt="8" w={["100%", "100%", "sm"]}>
                <Stack direction="row">
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
                              amount: balance,
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
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Stack>
          {account && (
            <>
              <Stack direction={["column", "column", "row"]} justify="space-between">
                <Text fontWeight="thin" fontSize="xs" align="center" w={["100%", "100%", "md"]} ml={[null, null, "-8", "-8", null, "-8"]}>
                  You will receive {vault.rewardToken.symbol} token as a receipt for your deposited {vault.stakeToken.symbol} assets. This
                  token is needed to withdraw your {vault.stakeToken.symbol}!
                </Text>
                <Stack align="center">
                  <Text fontWeight="thin" fontSize="xs" w="sm">
                    Withdrawal will result in:
                    <br />
                    Redeem {vault.rewardToken.symbol} token for {vault.stakeToken.symbol}
                  </Text>
                </Stack>
              </Stack>

              <HStack spacing={9} mb={3} />
              <HStack spacing={9} mb={3} />
            </>
          )}
        </Stack>

        <HStack mb={3} justify="space-between">
          <Link href={lpLink[vault.amm]} isExternal fontWeight="700" fontSize="xs" textDecoration="underline">
            Add liquidity in {vault.amm.toUpperCase()}
          </Link>
          <Link href={`https://explorer.harmony.one/address/${vault.address}`} textDecoration="underline" fontWeight="700" fontSize="xs">
            View on Harmony
          </Link>
        </HStack>
      </Collapse>
    </Box>
  );
};

import React from "react";
import { useState } from "react";
import { UseMutationResult } from "react-query";

import { displayTokenCurrencyDecimals, displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";

import {
  Button,
  Stack,
  Box,
  Text,
  HStack,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  StackDivider,
  Select,
} from "@chakra-ui/react";

import { UnlockButton } from "components/wallet/unlock-wallet";
import BigNumberJS from "bignumber.js";

type IProps = {
  id: number | string;
  canCompound: boolean;
  disableRewards?: boolean;
  hasWithdrawAll?: boolean;

  rewardToken: {
    symbol: string;
  };

  stakeTokens: {
    symbol: string;
    address: string;
    decimals: number;
  }[];

  unstakeToken?: {
    symbol: string;
    address: string;
    decimals: number;
  };

  rewardsEarned?: string;
  hasApprovedPool: boolean;
  userTotalStaked: string;
  userAvailableToUnstake?: string;
  balances: any;

  approve: UseMutationResult;
  deposit: UseMutationResult;
  depositAll: UseMutationResult;
  withdraw: UseMutationResult;
  withdrawAll?: UseMutationResult;
  harvest?: UseMutationResult;
  compound?: UseMutationResult;
};
export const UserSectionAlt: React.FC<IProps> = (props) => {
  const { account } = useActiveWeb3React();

  const [depositValue, setDepositValue] = useState("");
  const [depositPercentage, setDepositPercentage] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState("");
  const [withdrawPercentage, setWithdrawPercentage] = useState(0);

  const [stateTokenAddress, setStakeAddress] = useState(props.stakeTokens[0].address || "");
  const [unstakeTokenAddress, setUnstakeAddress] = useState(props.stakeTokens[0].address || "");

  if (!account) {
    return (
      <Stack align="center">
        <Text fontSize="md" mb={5}>
          Connect your wallet to access the vault
        </Text>
        <UnlockButton boxShadow="md" w={["100%", "50%"]} h={["4rem", "5rem"]} fontSize={["lg", "xl"]} colorScheme="accent" />
      </Stack>
    );
  }

  const stakeToken = props.stakeTokens.find((token) => token.address === stateTokenAddress)!;

  return (
    <Stack direction={["column", "column", "row"]} justify="space-between">
      {/* DEPOSIT SIDE */}
      <Box align="left">
        <HStack align="center" mb={1}>
          <Text fontWeight="400" fontSize="sm">
            Balance:
          </Text>

          <Button
            onClick={() => {
              if (props.balances[stateTokenAddress] !== "0.0") {
                setDepositPercentage(100);
                setDepositValue(new BigNumberJS(props.balances[stateTokenAddress]).times(100).div(100).decimalPlaces(18).toString());
              }
            }}
            colorScheme="white"
            variant="link"
          >
            <Text fontWeight="600" fontSize={["xs", "sm"]}>
              {props.balances[stateTokenAddress]
                ? displayTokenCurrencyDecimals(props.balances[stateTokenAddress], stakeToken.symbol, true, 8)
                : "N/A"}
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
              _focus={{ outline: "none" }}
              border="0px"
              pattern="^[0-9]*[.,]?[0-9]*$"
              focusBorderColor="secondary.500"
              placeholder="0.00"
              min="0"
              type="number"
              onChange={(e) => setDepositValue(new BigNumberJS(e.target.value).decimalPlaces(18).toString())}
              value={depositValue}
            />

            <Select
              fontSize="xs"
              size="sm"
              flex={1}
              border="0px"
              _focus={{ outline: "none" }}
              value={stateTokenAddress}
              onChange={(e) => setStakeAddress(e.target.value)}
            >
              {props.stakeTokens.map((token) => (
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
            value={depositPercentage}
            onChange={(depositPercentage) => {
              setDepositPercentage(depositPercentage);
              setDepositValue(
                new BigNumberJS(props.balances[stateTokenAddress]).times(depositPercentage).div(100).decimalPlaces(18).toString()
              );
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
            <Tooltip hasArrow bg="blue.400" color="white" placement="top" label={`${depositPercentage}%`}>
              <SliderThumb mt={5} boxSize={4}></SliderThumb>
            </Tooltip>
          </Slider>
        </Stack>

        <Stack align="center" justify="space-between" mt="8" w={["100%", "100%", "sm"]}>
          <Stack direction="row">
            {!props.hasApprovedPool && (
              <Button
                size="md"
                isLoading={props.approve.isLoading}
                onClick={() => props.approve.mutate(props.id)}
                bg="gray.700"
                boxShadow="lg"
                _hover={{ bg: "gray.600" }}
                w={["36", "48"]}
              >
                Approve
              </Button>
            )}
            {props.hasApprovedPool ? (
              <>
                <Button
                  isDisabled={props.balances[stateTokenAddress] === "0.0" || props.balances[stateTokenAddress] === undefined ? true : false}
                  isLoading={props.deposit.isLoading}
                  onClick={() => {
                    props.deposit
                      .mutateAsync({
                        amount: parseInt(depositValue, 10).toFixed(18).toString(),
                        id: props.id,
                      })
                      .then(() => {
                        setDepositPercentage(0);
                        setDepositValue("");
                      });
                  }}
                  size="md"
                  bg={"gray.700"}
                  _hover={{ bg: "gray.600" }}
                  w={["36", "48"]}
                >
                  Stake
                </Button>
                <Button
                  isDisabled={props.balances[stateTokenAddress] === "0.0" || props.balances[stateTokenAddress] === undefined ? true : false}
                  isLoading={props.depositAll.isLoading}
                  onClick={() => {
                    setDepositPercentage(100);
                    setDepositValue(new BigNumberJS(props.balances[stateTokenAddress]).times(100).div(100).decimalPlaces(18).toString());
                    props.depositAll
                      .mutateAsync({
                        id: props.id,
                      })
                      .then(() => {
                        setDepositPercentage(0);
                        setDepositValue("");
                      });
                  }}
                  size="md"
                  bg={"gray.700"}
                  _hover={{ bg: "gray.600" }}
                  w={["36", "48"]}
                >
                  Stake All
                </Button>
              </>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      {/* WITHDRAW SIDE */}
      <Box align="left">
        <HStack align="center" mb={1}>
          <Text fontWeight="400" fontSize="xs">
            Staked:
          </Text>
          <Button
            onClick={() => {
              if (props.userTotalStaked !== "0") {
                setWithdrawPercentage(100);
                setWithdrawValue(new BigNumberJS(100).times(props.userTotalStaked).div(100).decimalPlaces(18).toString());
              }
            }}
            colorScheme={"white"}
            variant="link"
          >
            <Text fontWeight="600" fontSize={["xs", "sm"]}>
              {props.userTotalStaked ? displayTokenCurrencyDecimals(props.userTotalStaked, props.stakeTokens[0].symbol, false, 8) : "N/A"}
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
              _focus={{ outline: "none" }}
              border="0px"
              pattern="^[0-9]*[.,]?[0-9]*$"
              focusBorderColor="secondary.500"
              placeholder="0.00"
              min="0"
              type="number"
              onChange={(withdrawValue) => setWithdrawValue(new BigNumberJS(withdrawValue.target.value).decimalPlaces(18).toString())}
              value={withdrawValue}
            />

            <Select
              fontSize="xs"
              size="sm"
              flex={1}
              border="0px"
              _focus={{ outline: "none" }}
              value={unstakeTokenAddress}
              onChange={(e) => setUnstakeAddress(e.target.value)}
            >
              {props.stakeTokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </Select>
          </Stack>
          <Slider
            aria-label="withdraw-slider"
            defaultValue={0}
            min={0}
            max={100}
            value={withdrawPercentage}
            onChange={(withdrawPercentage) => {
              setWithdrawPercentage(withdrawPercentage);
              setWithdrawValue(new BigNumberJS(withdrawPercentage).times(props.userTotalStaked).div(100).decimalPlaces(18).toString());
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
              <SliderFilledTrack bgGradient={`linear(to-l, pink.400, green.200)`} />
            </SliderTrack>
            <Tooltip hasArrow bg="blue.400" color="white" placement="top" label={`${withdrawPercentage}%`}>
              <SliderThumb mt={5} boxSize={4}></SliderThumb>
            </Tooltip>
          </Slider>
        </Stack>

        <Stack direction={["column", "row"]} align="center" justify="space-evenly" mt={["4", "8"]} w={["100%", "100%", "sm"]}>
          <Button
            isDisabled={!withdrawValue || props.userTotalStaked === "0" ? true : false}
            isLoading={props.withdraw.isLoading}
            size="md"
            bg={"gray.700"}
            _hover={{ bg: "gray.600" }}
            w={["36", "48"]}
            onClick={() => {
              withdrawPercentage === 100
                ? props.withdrawAll.mutateAsync({ id: props.id }).then(() => {
                    setWithdrawPercentage(0);
                    setWithdrawValue("");
                  })
                : props.withdraw
                    .mutateAsync({
                      amount: parseInt(withdrawValue, 10).toFixed(18).toString(),
                      id: props.id,
                    })
                    .then(() => {
                      setWithdrawPercentage(0);
                      setWithdrawValue("");
                    });
            }}
          >
            Withdraw
          </Button>

          <Button
            isDisabled={props.userTotalStaked === "0" ? true : false}
            isLoading={props.withdrawAll.isLoading}
            size="md"
            bg={"gray.700"}
            _hover={{ bg: "gray.600" }}
            onClick={() => {
              setWithdrawPercentage(100);
              setWithdrawValue(new BigNumberJS(100).times(props.userTotalStaked).div(100).decimalPlaces(18).toString());
              props.withdrawAll.mutateAsync({ id: props.id }).then(() => {
                setWithdrawPercentage(0);
                setWithdrawValue("");
              });
            }}
            w={["36", "48"]}
          >
            Withdraw All
          </Button>
        </Stack>
      </Box>

      {!props.disableRewards && (
        <Box align="left">
          <Text mb={1} fontWeight="600" fontSize="sm">
            {props.rewardToken.symbol} Earned
          </Text>

          <Stack align="center" direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="2xl">
              {props.rewardsEarned ? displayTokenCurrency(props.rewardsEarned, "") : "N/A"}
            </Text>

            {props.hasApprovedPool && (
              <Stack direction="row">
                <Button
                  isLoading={props.harvest.isLoading}
                  onClick={() => props.harvest.mutate({ id: props.id, amount: "0" })}
                  size="xs"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                >
                  Harvest
                </Button>

                {props.canCompound && (
                  <Button
                    isLoading={props.compound?.isLoading}
                    onClick={() =>
                      props.compound?.mutate({
                        id: props.id,
                        amount: props.rewardsEarned,
                      })
                    }
                    size="xs"
                    bg="gray.700"
                    _hover={{ bg: "gray.600" }}
                  >
                    Compound
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

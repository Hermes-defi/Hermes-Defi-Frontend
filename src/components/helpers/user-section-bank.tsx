import React from "react";
import { UseMutationResult } from "react-query";

import { displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";

import {
  useDisclosure,
  Button,
  Stack,
  Box,
  Text,
  HStack,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { UnlockButton } from "components/wallet/unlock-wallet";

import { DepositModal } from "components/modals/deposit-modal";
import { WithdrawModal } from "components/modals/withdraw-modal";
import { useStakeWithdraw } from "state/stake-bank";
import { usePlutusPrice } from "hooks/prices";
import BigNumber from "bignumber.js";

type IDepositProps = {
  primary?: boolean;

  address: string;
  stakeToken: {
    symbol: string;
    address: string;
    decimals: number;
  };

  deposit: UseMutationResult;
};
const DepositButton: React.FC<IDepositProps> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        size="sm"
        bg={"gray.700"}
        _hover={{ bg: props.primary ? "secondary.500" : "gray.600" }}
        onClick={onOpen}
      >
        {props.children}
      </Button>

      <DepositModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.stakeToken.symbol}
        tokenAddress={props.stakeToken.address}
        tokenDecimals={props.stakeToken.decimals}
        isLoading={props.deposit.isLoading}
        onDeposit={(amount: string) =>
          props.deposit
            .mutateAsync({ amount, address: props.address })
            .then(() => onClose())
        }
      />
    </>
  );
};

type IUnstakeProps = {
  primary?: boolean;

  address: string;
  hasWithdrawAll?: boolean;
  userTotalStaked: string;
  stakeToken: {
    symbol: string;
  };

  withdraw: UseMutationResult;
  withdrawAll?: UseMutationResult;
};
const UnstakeButton: React.FC<IUnstakeProps> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        size="sm"
        bg={"gray.700"}
        _hover={{ bg: "gray.600" }}
        onClick={onOpen}
      >
        {props.children}
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        hasWithdrawAll={props.hasWithdrawAll}
        token={props.stakeToken.symbol}
        tokenBalance={props.userTotalStaked}
        isLoading={props.withdraw.isLoading}
        onWithdrawAll={() =>
          props.withdrawAll
            .mutateAsync({ address: props.address })
            .then(() => onClose())
        }
        onWithdraw={(amount: string) =>
          props.withdraw
            .mutateAsync({ amount, address: props.address })
            .then(() => onClose())
        }
      />
    </>
  );
};

type IProps = {
  address: string;
  canCompound: boolean;
  disableRewards?: boolean;
  hasWithdrawAll?: boolean;

  rewardToken: {
    symbol: string;
    price?: string;
  };

  stakeToken: {
    symbol: string;
    address: string;
    decimals: number;
  };

  unstakeToken?: {
    symbol: string;
    address: string;
    decimals: number;
  };

  rewardsEarned?: string;
  hasApprovedPool: boolean;
  userTotalStaked: string;
  userAvailableToUnstake?: string;

  approve: UseMutationResult;
  deposit: UseMutationResult;
  withdraw: UseMutationResult;
  withdrawAll?: UseMutationResult;
  harvest?: UseMutationResult;
  compound?: UseMutationResult;
};
export const UserSection: React.FC<IProps> = (props) => {
  const { account } = useActiveWeb3React();
  const harvestMutation = useStakeWithdraw();
  const plutusPrice = usePlutusPrice();
  if (!account) {
    return (
      <UnlockButton
        boxShadow="2xl"
        colorScheme={(() => {
          if (props.rewardToken.symbol === "1DAI") return "secondary";
          else return "primary";
        })()}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <HStack justify="space-evenly" ml={props.rewardToken.symbol === "LUMEN" ? "-6" : "0"}>
        <Box align="center">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
            {props.stakeToken.symbol} Locked
          </Heading>

          <Stack direction="column">
            <Text fontWeight="700" fontSize="2xl" align="center">
              {props.userTotalStaked
                ? displayTokenCurrency(props.userTotalStaked, "")
                : "N/A"}
            </Text>
          </Stack>
          <Stack direction="column">
            <Text fontWeight="600" fontSize="sm" align="center">
              {props.userTotalStaked
                ? "(" +
                  displayTokenCurrency(
                    new BigNumber(props.userTotalStaked)
                      .times(plutusPrice.data)
                      .toNumber(),
                    ""
                  ) +
                  "$)"
                : "N/A"}
            </Text>
          </Stack>
          <Stack >
            <HStack mt={"3"}>
              {props.hasApprovedPool && (
                <DepositButton
                  address={props.address}
                  stakeToken={props.stakeToken}
                  deposit={props.deposit}
                >
                  Deposit $PLTS
                </DepositButton>
              )}
              {props.hasApprovedPool &&
                (props.rewardToken.symbol === "1DAI" ||
                  props.rewardToken.symbol === "LUMEN") && (
                  <Button
                    onClick={() => props.withdrawAll.mutateAsync(props.address)}
                    size={"sm"}
                    bg={"gray.700"}
                    _hover={{ bg: "gray.600" }}
                  >
                    Withdraw All
                  </Button>
                )}
            </HStack>
          </Stack>
        </Box>
        <Box>
          {!props.disableRewards && (
            <Box align="center">
              <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
                {props.rewardToken.symbol} Earned
              </Heading>

              <Stack align="center" direction="column">
                <Text fontWeight="bold" fontSize="2xl">
                  {props.rewardsEarned
                    ? displayTokenCurrency(props.rewardsEarned, "")
                    : "(0$)"}
                </Text>
              </Stack>
              <Stack align="center" direction="column">
                <Text fontWeight="bold" fontSize="sm">
                  {props.rewardsEarned
                    ? "(" +
                      displayTokenCurrency(
                        new BigNumber(props.rewardsEarned)
                          .times(props.rewardToken.price)
                          .toNumber(),
                        ""
                      ) +
                      "$)"
                    : "(0$)"}
                </Text>
              </Stack>
            </Box>
          )}
          {props.hasApprovedPool && (
            <Stack direction="row" mt={"3"}>
              <Button
                isDisabled={!props.userTotalStaked}
                isLoading={harvestMutation.isLoading}
                onClick={() => harvestMutation.mutate(props.address)}
                size="sm"
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
              >
                Harvest {props.rewardToken.symbol}
              </Button>
            </Stack>
          )}
        </Box>
      </HStack>
      <Stack direction="row" justify={"space-evenly"}>
        {!props.hasApprovedPool && (
          <Button
            isFullWidth
            isLoading={props.approve.isLoading}
            onClick={() => props.approve.mutate(props.address)}
            bg="gray.700"
            boxShadow="lg"
            _hover={{ bg: "gray.600" }}
            mx={"58"}
            size="sm"
          >
            Approve
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

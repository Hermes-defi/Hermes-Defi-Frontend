import React from "react";
import { UseMutationResult } from "react-query";

import { displayTokenCurrency } from "libs/utils";
import { useActiveWeb3React } from "wallet";

import { useDisclosure, Button, Stack, Box, Text, HStack, useColorModeValue, Heading } from "@chakra-ui/react";
import { UnlockButton } from "components/wallet/unlock-wallet";

import { DepositModal } from "components/modals/deposit-modal";
import { WithdrawModal } from "components/modals/withdraw-modal";
import { useStakeWithdraw } from "state/stake-bank";

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
          props.deposit.mutateAsync({ amount, address: props.address }).then(() => onClose())
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
      <Button size="sm" bg={"gray.700"} _hover={{ bg: "gray.600" }} onClick={onOpen}>
        {props.children}
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        hasWithdrawAll={props.hasWithdrawAll}
        token={props.stakeToken.symbol}
        tokenBalance={props.userTotalStaked}
        isLoading={props.withdraw.isLoading}
        onWithdrawAll={() => props.withdrawAll.mutateAsync({ address: props.address }).then(() => onClose())}
        onWithdraw={(amount: string) =>
          props.withdraw.mutateAsync({ amount, address: props.address }).then(() => onClose())
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
  if (!account) {
    return <UnlockButton boxShadow="2xl" colorScheme={( () =>{
      if(props.rewardToken.symbol === "1DAI") return "secondary"
      else "primary"
    }
    )()}/>;
  }

  return (
    <Stack spacing={4}>
      <HStack justify="space-around">
      <Box align="center">
      <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
          {props.stakeToken.symbol} Locked
        </Heading>

        <Stack direction="column">
          <Text fontWeight="700" fontSize="2xl" align="center">
            {props.userTotalStaked ? displayTokenCurrency(props.userTotalStaked, "") : "N/A"}
          </Text>

        </Stack>
      </Box>

      {!props.disableRewards && (
        <Box align="center">
          <Heading letterSpacing="1px" color="gray.200" fontSize="lg">
            {props.rewardToken.symbol} Earned
          </Heading>

          <Stack align="center" direction="column">
            <Text fontWeight="bold" fontSize="2xl">
              {props.rewardsEarned ? displayTokenCurrency(props.rewardsEarned, "") : "N/A"}
            </Text>
          </Stack>
        </Box>
      )}
      </HStack>
      <Stack justify="space-around" direction="row">
            {!props.hasApprovedPool && (
              <Button
                isFullWidth
                isLoading={props.approve.isLoading}
                onClick={() => props.approve.mutate(props.address)}
                bg="gray.700"
                boxShadow="lg"
                _hover={{ bg: "gray.600" }}
                mx="40"
              >
                Approve
              </Button>
            )}

            {props.hasApprovedPool && (
              
                  <DepositButton
                    address={props.address}
                    stakeToken={props.stakeToken}
                    deposit={props.deposit}
                  >
                    Deposit $PLUTUS
                  </DepositButton>
              )
            }
              {props.hasApprovedPool && (
              <Stack direction="row">
                <Button
                  isDisabled={!props.userTotalStaked}
                  isLoading={harvestMutation.isLoading}
                  onClick={() => harvestMutation.mutate(props.address)}
                  size="sm"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                >
                  Harvest 1DAI
                </Button>
              </Stack>
            )}
          </Stack>

    </Stack>
  );
};

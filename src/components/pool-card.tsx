import React from "react";
import BigNumber from "bignumber.js";
import { useActiveWeb3React } from "wallet";
import { displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";
import { DepositModal } from "components/modals/deposit-modal";
import { WithdrawModal } from "components/modals/withdraw-modal";
import { useApprovePool, useDepositIntoPool, useWithdraw } from "hooks/pools/actions";
import { PoolInfo } from "config/pools";

import {
  Box,
  HStack,
  Heading,
  Badge,
  Stack,
  Button,
  Image,
  Icon,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineCalculator } from "react-icons/ai";
import { UnlockButton } from "./unlock-wallet";
import { APRModal } from "./modals/roi-modal";
import { useIrisPrice } from "hooks/prices";

// Pool Actions
const DepositButton: React.FC<{ pool: PoolInfo; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const depositMutation = useDepositIntoPool();

  return (
    <>
      <Button
        size="sm"
        bg={props.primary ? "primary.600" : "gray.700"}
        _hover={{ bg: props.primary ? "primary.500" : "gray.600" }}
        onClick={onOpen}
      >
        {props.children}
      </Button>

      <DepositModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.pool.lpToken}
        tokenAddress={props.pool.lpAddress}
        tokenDecimals={props.pool.decimals}
        isLoading={depositMutation.isLoading}
        onDeposit={(amount: string) =>
          depositMutation.mutateAsync({ pid: props.pool.pid, amount }).then(() => onClose())
        }
      />
    </>
  );
};

const UnstakeButton: React.FC<{ pool: PoolInfo; primary?: boolean }> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const withdrawMutation = useWithdraw();

  return (
    <>
      <Button size="sm" bg={"gray.700"} _hover={{ bg: "gray.600" }} onClick={onOpen}>
        {props.children}
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        token={props.pool.lpToken}
        tokenBalance={props.pool.lpStaked}
        isLoading={withdrawMutation.isLoading}
        onWithdraw={(amount: string) =>
          withdrawMutation.mutateAsync({ pid: props.pool.pid, amount }).then(() => onClose())
        }
      />
    </>
  );
};

const UserSection: React.FC<{ pool: PoolInfo }> = ({ pool }) => {
  const { account } = useActiveWeb3React();
  const approveMutation = useApprovePool();
  const compoundMutation = useDepositIntoPool();
  const harvestMutation = useDepositIntoPool();

  if (!account) {
    return <UnlockButton boxShadow="2xl" />;
  }

  return (
    <Stack spacing={4}>
      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          {pool.lpStaked
            ? displayTokenCurrency(pool.lpStaked, pool.lpToken)
            : `N/A ${pool.lpToken}`}{" "}
          Staked
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {pool.lpStaked ? displayTokenCurrency(pool.lpStaked, "") : "N/A"}
          </Text>

          <Stack direction="row">
            {!pool.hasApprovedPool && (
              <Button
                size="sm"
                isLoading={approveMutation.isLoading}
                onClick={() => approveMutation.mutate(pool.pid)}
                bg="gray.700"
                boxShadow="lg"
                _hover={{ bg: "gray.600" }}
              >
                Approve
              </Button>
            )}

            {pool.hasApprovedPool &&
              (Number(pool.lpStaked) > 0 ? (
                <>
                  <UnstakeButton pool={pool}>-</UnstakeButton>

                  <DepositButton pool={pool} primary>
                    +
                  </DepositButton>
                </>
              ) : (
                <DepositButton pool={pool}>Stake</DepositButton>
              ))}
          </Stack>
        </Stack>
      </Box>

      <Box align="left">
        <Text mb={1} fontWeight="600" fontSize="sm">
          Iris Earned
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {pool.irisEarned ? displayTokenCurrency(pool.irisEarned, "") : "N/A"}
          </Text>

          {pool.hasApprovedPool && (
            <Stack direction="row">
              <Button
                isLoading={harvestMutation.isLoading}
                onClick={() => harvestMutation.mutate({ pid: pool.pid, amount: "0" })}
                size="xs"
                bg="gray.700"
                _hover={{ bg: "gray.600" }}
              >
                Harvest
              </Button>

              {pool.lpToken.toLowerCase() === "iris" && (
                <Button
                  isLoading={compoundMutation.isLoading}
                  onClick={() =>
                    compoundMutation.mutate({ pid: pool.pid, amount: pool.irisEarned })
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
    </Stack>
  );
};

function APRCalculator({ pool }: { pool: PoolInfo }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: irisPrice } = useIrisPrice();

  return (
    <>
      <Icon onClick={onOpen} mr={1} as={AiOutlineCalculator} />
      <APRModal
        isOpen={isOpen}
        onClose={onClose}
        aprs={pool.apr}
        stakeToken={{
          symbol: pool.lpToken,
          link: pool.isBalancer
            ? `https://polygon.balancer.fi/#/pool/${pool.balancerAddress}`
            : pool.isFarm
            ? `https://quickswap.exchange/#/add/${pool.pairTokens[0].tokenAddress}/${pool.pairTokens[1].tokenAddress}`
            : `https://quickswap.exchange/#/swap/${pool.lpAddress}`,
        }}
        rewardToken={{
          symbol: "IRIS",
          price: irisPrice,
        }}
      />
    </>
  );
}

export const PoolCard: React.FC<{ pool: PoolInfo }> = ({ pool }) => {
  return (
    <Box
      px={8}
      py={4}
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={
        pool.isSpecial
          ? `linear(to-b, primary.300, accent.500)`
          : `linear(to-t, accent.300, accent.500)`
      }
      rounded="3xl"
      color="white"
    >
      {/* pool name */}
      <HStack align="center" mb={5} spacing={2}>
        {Array.isArray(pool.poolImage) ? (
          <Box w={12} h={12} pos="relative">
            <Image
              pos="absolute"
              top="5px"
              left="0"
              rounded="12px"
              src={pool.poolImage[0]}
              boxSize={6}
            />
            <Image
              pos="absolute"
              bottom="-5px"
              right="0px"
              rounded="20px"
              src={pool.poolImage[0]}
              boxSize={10}
            />
          </Box>
        ) : (
          <Image
            border="2px"
            borderColor="white"
            bg="white"
            rounded="24px"
            src={pool.poolImage as string}
            boxSize={12}
          />
        )}

        <Heading fontSize="3xl">{pool.lpToken}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={6} spacing={2}>
        {pool.multiplier && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="gray">
            {pool.multiplier}x
          </Badge>
        )}

        {!pool.depositFees && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="green">
            No Fees
          </Badge>
        )}
        {pool.farmDx && (
          <Badge boxShadow="md" px={2} rounded="lg" colorScheme="blue">
            {pool.farmDx}
          </Badge>
        )}
      </HStack>

      {/* pool details */}
      <Stack mb={6}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            APR
          </Text>
          <Box display="flex" alignItems="center">
            {pool.apr && <APRCalculator pool={pool} />}
            <Text fontWeight="700" fontSize="sm">
              {pool.apr ? `${displayNumber(Math.round(pool.apr.yearlyAPR))}%` : "N/A"}
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Earn
          </Text>
          <Text fontWeight="700" fontSize="sm">
            IRIS
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="600" fontSize="sm">
            Deposit Fee
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {pool.depositFees}%
          </Text>
        </Stack>
      </Stack>

      <Stack mb={8}>
        <UserSection pool={pool} />
      </Stack>

      {/* pool extra details */}
      <Box align="left">
        <Heading mb={3} fontSize="xl">
          Details
        </Heading>

        <Stack mb={5}>
          {pool.isFarm && (
            <Stack direction="row" justify="space-between">
              <Text fontWeight="700" fontSize="sm">
                LP Token Price
              </Text>
              <Text fontWeight="700" fontSize="sm">
                {displayCurrency(pool.price || 0)}
              </Text>
            </Stack>
          )}

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Deposit
            </Text>
            <Link
              href={
                pool.isBalancer
                  ? `https://polygon.balancer.fi/#/pool/${pool.balancerAddress}`
                  : pool.isFarm
                  ? `https://quickswap.exchange/#/add/${pool.pairTokens[0].tokenAddress}/${pool.pairTokens[1].tokenAddress}`
                  : `https://quickswap.exchange/#/swap/${pool.lpAddress}`
              }
              isExternal
              fontWeight="700"
              fontSize="sm"
            >
              {pool.lpToken}
            </Link>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {pool.totalStaked
                ? displayCurrency(new BigNumber(pool.totalStaked).times(pool.price || 0).toNumber())
                : "N/A"}
            </Text>
          </Stack>
        </Stack>

        <Link
          href={`https://polygonscan.com/token/${pool.lpAddress}`}
          textDecoration="underline"
          fontWeight="700"
          fontSize="sm"
        >
          View on Matic
        </Link>
      </Box>
    </Box>
  );
};

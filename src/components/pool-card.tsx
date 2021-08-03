import React from "react";
import BigNumber from "bignumber.js";
import { useActiveWeb3React } from "wallet";
import { displayCurrency } from "libs/utils";
import { DepositModal } from "components/modals/deposit-modal";
import { WithdrawModal } from "components/modals/withdraw-modal";
import { useApprovePool, useDepositIntoPool } from "hooks/pools-actions";
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
import { ROIModal } from "./modals/roi-modal";

// Pool Actions
const DepositButton: React.FC<any> = ({ pool, modalProps, ...props }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} {...props} />

      <DepositModal pool={pool} isOpen={isOpen} onClose={onClose} {...modalProps} />
    </>
  );
};

const UnstakeButton: React.FC<any> = ({ pool, ...props }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} {...props} />

      <WithdrawModal pool={pool} isOpen={isOpen} onClose={onClose} />
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
          {displayCurrency(pool.lpStaked, true)} {pool.lpToken} Stacked
        </Text>

        <Stack align="center" direction="row" justify="space-between">
          <Text fontWeight="700" fontSize="2xl">
            {displayCurrency(pool.lpStaked, true)}
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
                  <UnstakeButton pool={pool} size="sm" bg="gray.700" _hover={{ bg: "gray.600" }}>
                    -
                  </UnstakeButton>

                  <DepositButton
                    pool={pool}
                    size="sm"
                    bg="primary.600"
                    _hover={{ bg: "primary.500" }}
                  >
                    +
                  </DepositButton>
                </>
              ) : (
                <DepositButton pool={pool} size="sm" bg="gray.700" _hover={{ bg: "gray.600" }}>
                  Stake
                </DepositButton>
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
            {displayCurrency(pool.irisEarned, true)}
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

export function APRCalculator() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Icon onClick={onOpen} mr={1} as={AiOutlineCalculator} />
      <ROIModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

const imageMapper = {
  iris: "/hermes-logo-1.png",
  weth: "/eth-logo.png",
  wbtc: "/btc-logo.png",
  wmatic: "/matic-logo.png",
  quick: "/quickswap-logo.jpeg",
  usdc: "/usdc-logo.png",
  usdt: "/usdt-logo.png",
  dai: "/dai-logo.png",
  "iris/wmatic": ["/hermes-logo-1.png", "/matic-logo.png"],
};
export const PoolCard: React.FC<{ pool: PoolInfo }> = ({ pool }) => {
  const irisCard = pool.pid === 8 || pool.pid === 0;
  return (
    <Box
      px={8}
      py={4}
      bg="accent.500"
      boxShadow="rgb(179 142 89 / 65%) 0px 25px 50px -12px"
      bgGradient={
        irisCard ? `linear(to-b, primary.300, accent.500)` : `linear(to-t, accent.300, accent.500)`
      }
      rounded="3xl"
      color="white"
    >
      {/* pool name */}
      <HStack align="center" mb={5} spacing={2}>
        {Array.isArray(imageMapper[pool.lpToken.toLowerCase()]) ? (
          <Box w={12} h={12} pos="relative">
            <Image
              pos="absolute"
              top="5px"
              left="0"
              rounded="12px"
              src={imageMapper[pool.lpToken.toLowerCase()][0]}
              boxSize={6}
            />
            <Image
              pos="absolute"
              bottom="-5px"
              right="0px"
              rounded="20px"
              src={imageMapper[pool.lpToken.toLowerCase()][1]}
              boxSize={10}
            />
          </Box>
        ) : (
          <Image
            border="2px"
            borderColor="white"
            bg="white"
            rounded="24px"
            src={imageMapper[pool.lpToken.toLowerCase()]}
            boxSize={12}
          />
        )}

        <Heading>{pool.lpToken}</Heading>
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
            {/* <APRCalculator /> */}
            <Text fontWeight="700" fontSize="sm">
              {/* TODO:: price */}
              {pool.apr ? `${pool.apr}%` : "N/A"}
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
          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Deposit
            </Text>
            <Link
              href={`https://quickswap.exchange/#/swap/${pool.lpAddress}`}
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
              {displayCurrency(new BigNumber(pool.totalStaked).times(pool.price || 0).toNumber())}
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

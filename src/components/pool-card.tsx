import React from "react";
import {
  Box,
  HStack,
  Heading,
  Badge,
  Stack,
  Button,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiUnlock } from "react-icons/fi";
import { PoolInfo, useApprovePoolCb, usePoolInfo } from "hooks/pools";
import { useActiveWeb3React } from "wallet";
import { displayCurrency } from "libs/utils";
import { WalletModal } from "components/wallet/modal";
import { DepositModal } from "components/modals/deposit-modal";

const UnlockButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button isFullWidth onClick={onOpen} rightIcon={<FiUnlock />} colorScheme="primary">
        Unlock
      </Button>

      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const ApproveButton: React.FC<{ pid: number }> = ({ pid }) => {
  const { requestingApproval, approve } = useApprovePoolCb();

  return (
    <Button
      isFullWidth
      isLoading={requestingApproval}
      onClick={() => approve(pid)}
      colorScheme="primary"
    >
      Approve
    </Button>
  );
};

const DepositButton: React.FC<{ pid: number }> = ({ pid }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { state } = usePoolInfo();

  return (
    <>
      <Button isFullWidth onClick={onOpen} colorScheme="primary">
        Deposit
      </Button>

      <DepositModal pool={state.pools[pid]} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export const PoolCard: React.FC<{ pool: PoolInfo }> = ({ pool }) => {
  const { account } = useActiveWeb3React();

  return (
    <Box px={8} py={4} boxShadow="lg" rounded="3xl" bg="accent.500" color="white">
      {/* pool name */}
      <HStack mb={5} spacing={6}>
        <Heading>{pool.token}</Heading>
      </HStack>

      {/* pool badges */}
      <HStack mb={8} spacing={4}>
        {pool.multiplier && (
          <Badge px={2} rounded="lg" colorScheme="gray">
            {pool.multiplier}x
          </Badge>
        )}

        {!pool.depositFees && (
          <Badge px={2} rounded="lg" colorScheme="green">
            No Fees
          </Badge>
        )}
        {/* <Badge px={2} rounded="lg" colorScheme="red">
            Community
          </Badge> */}
      </HStack>

      {/* pool details */}
      <Stack mb={8}>
        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            APY
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {Math.trunc(pool.apy)}%
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            APR
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {Math.trunc(pool.apr)}%
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            Earn
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {pool.earn}
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            Deposit Fee
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {pool.depositFees}%
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            IRIS Earned
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {displayCurrency(pool.irisEarned)}
          </Text>
        </Stack>

        <Stack direction="row" justify="space-between">
          <Text fontWeight="900" fontSize="sm">
            IRIS Staked
          </Text>
          <Text fontWeight="700" fontSize="sm">
            {displayCurrency(pool.irisStaked)}
          </Text>
        </Stack>
      </Stack>

      {/* pool actions */}
      <Stack mb={8} align="center">
        {/* stake button */}
        {!account && <UnlockButton />}
        {account ? (
          !pool.userApproved ? (
            <ApproveButton pid={pool.pid} />
          ) : (
            <DepositButton pid={pool.pid} />
          )
        ) : null}

        <Button isFullWidth bg="gray.700" _hover={{ bg: "gray.600" }}>
          Harvest
        </Button>
        <Button isFullWidth bg="gray.700" _hover={{ bg: "gray.600" }}>
          Compound
        </Button>
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
            <Text fontWeight="700" fontSize="sm">
              {pool.token}
            </Text>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              Total Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {displayCurrency(pool.totalLiquidity)}
            </Text>
          </Stack>

          <Stack direction="row" justify="space-between">
            <Text fontWeight="700" fontSize="sm">
              My Liquidity
            </Text>
            <Text fontWeight="700" fontSize="sm">
              {displayCurrency(pool.userLiquidity)}
            </Text>
          </Stack>
        </Stack>

        <Link href="/" textDecoration="underline" fontWeight="700" fontSize="sm">
          View on Matic
        </Link>
      </Box>
    </Box>
  );
};

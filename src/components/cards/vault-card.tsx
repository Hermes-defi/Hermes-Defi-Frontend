import React from "react";
import BigNumber from "bignumber.js";
import { Vault } from "config/vaults";

import {
  useApproveVault,
  useDepositIntoVault,
  useWithdrawAllFromVault,
  useWithdrawFromVault,
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
} from "@chakra-ui/react";
import { UserSectionAlt } from "components/helpers/user-section-alt";

import {
  displayCurrency,
  displayNumber,
  displayTokenCurrency,
} from "libs/utils";
import { useActiveWeb3React } from "wallet";
import { useTokenBalance } from "hooks/wallet";

export const VaultCard: React.FC<{ vault: Vault }> = ({ vault }) => {
  const approveMutation = useApproveVault();
  const depositMutation = useDepositIntoVault();
  const withdrawMutation = useWithdrawFromVault();
  const withdrawAllMutation = useWithdrawAllFromVault();
  const { isOpen, onToggle } = useDisclosure();
  const { account } = useActiveWeb3React();
  const balance = useTokenBalance(
    vault.stakeToken.address,
    vault.stakeToken.decimals
  );

  const lpLink = {
    quickswap: `https://quickswap.exchange/#/add/${vault.pairs[0].address}/${vault.pairs[1].address}`,
    dfyn: `https://info.dfyn.network/pair/${vault.stakeToken.address}`,
    sushiswap: `https://app.sushi.com/add/${vault.pairs[0].address}/${vault.pairs[1].address}`,
  };

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
      {/* farm name */}
      <Stack direction={["column", "column", "row"]} justify="space-between" onClick={onToggle}>
        <Stack align="center" mb={5} spacing={2}>
          <Box w={12} h={12} pos="relative">
            <Image
              pos="absolute"
              top="5px"
              left="0"
              rounded="12px"
              src={vault.stakeToken.logo[0]}
              boxSize={6}
            />
            <Image
              pos="absolute"
              bottom="-5px"
              right="0px"
              rounded="20px"
              src={vault.stakeToken.logo[1]}
              boxSize={10}
            />
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
              label={`
            Deposit fee ${vault.depositFees}% 

            Withdrawal fee ${vault.withdrawFees}% 

            Perfomance fee ${vault.performanceFee * 100}%
            `}
              fontSize="xs"
              textAlign="center"
              width="32"
              rounded="lg"
              px={2}
            >
              <Badge
                boxShadow="md"
                px={2}
                rounded="lg"
                bg={"gray.700"}
                _hover={{ bg: "gray.600" }}
                color="white"
                w="14"
              >
                Fees
              </Badge>
            </Tooltip>
          </HStack>
        </Stack>

        <Stack direction={["row", "row", "column"]} justify={"center"}>
          <Text fontWeight="700" fontSize="lg">
            {balance ? displayTokenCurrency(balance, "") : "N/A"}
          </Text>
          <Text>Wallet</Text>
        </Stack>

        <Stack direction={["row", "row","column"]} justify="center">
          <Text fontWeight="700" fontSize="lg">
            {vault.userTotalStaked
              ? displayTokenCurrency(vault.userTotalStaked, "")
              : "N/A"}
          </Text>
          <Text>Staked</Text>
        </Stack>

        <Stack direction={["row","row", "column"]} justify="center">
          <Box alignItems="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy ? `${displayNumber(vault.apy.yearly, true)}%` : "N/A"}
            </Text>
            <Text>APY</Text>
          </Box>
        </Stack>
        <Stack direction={["row", "row","column"]} justify="center">
          <Box alignItems="center">
            <Text fontWeight="700" fontSize="lg">
              {vault.apy
                ? `${displayNumber(vault.apy.daily, false, 3)}%`
                : "N/A"}
            </Text>
            <Text>Daily</Text>
          </Box>
        </Stack>
        <Stack direction={["row", "row","column"]} justify="center">
          <Text fontWeight="700" fontSize="lg">
            {vault.totalStaked
              ? displayCurrency(
                  new BigNumber(vault.totalStaked)
                    .times(vault.stakeToken.price || 0)
                    .toNumber()
                )
              : "N/A"}
          </Text>
          <Text>Total Liquidity</Text>
        </Stack>
      </Stack>

      <Collapse in={isOpen} animateOpacity>
        <Divider borderColor="gray.200" mb={7} />
        <Stack mb={8} >
          <UserSectionAlt
            id={vault.address}
            disableRewards
            hasWithdrawAll
            canCompound={false}
            stakeToken={vault.stakeToken}
            unstakeToken={{
              address: vault.address,
              ...vault.rewardToken,
            }}
            rewardToken={{ symbol: vault.rewardToken.symbol }}
            hasApprovedPool={vault.hasApprovedPool}
            userTotalStaked={vault.userTotalStaked}
            userAvailableToUnstake={vault.userAvailableToUnstake}
            approve={approveMutation}
            deposit={depositMutation}
            withdraw={withdrawMutation}
            withdrawAll={withdrawAllMutation}
          />
        </Stack>

        <Stack>
          {account ? (
            <>
              {/* <Box align="center" w="md" ml="-8"> */}
              <Stack direction={["column", "column", "row"]} justify="space-between">
                <Text
                  fontWeight="thin"
                  fontSize="xs"
                  align="center"
                  w={["100%", "100%", "md"]}
                  ml={[null, null, "-8", "-8", null, "-8"]}
                >
                  You will receive {vault.rewardToken.symbol} token as a receipt
                  for your deposited {vault.stakeToken.symbol} assets. This
                  token is needed to withdraw your {vault.stakeToken.symbol}!
                </Text>
                <Stack align="center">
                  <Text fontWeight="thin" fontSize="xs" w="sm">
                    Withdrawal will result in:
                    <br/>
                    Redeem {vault.rewardToken.symbol} token for{" "}
                    {vault.stakeToken.symbol}
                  </Text>
                </Stack>
              </Stack>

              <HStack spacing={9} mb={3}></HStack>

              <HStack spacing={9} mb={3}></HStack>
              {/* </Box> */}
            </>
          ) : (
            <Box></Box>
          )}
        </Stack>
        <HStack mb={3} justify="space-between">
          <Link
            href={lpLink[vault.amm]}
            isExternal
            fontWeight="700"
            fontSize="xs"
            textDecoration="underline"
          >
            Deposit in {vault.amm.toUpperCase()}
          </Link>
          <Link
            href={`https://explorer.harmony.one/address/${vault.address}`}
            textDecoration="underline"
            fontWeight="700"
            fontSize="xs"
          >
            View on Harmony
          </Link>
        </HStack>
      </Collapse>
    </Box>
  );
};

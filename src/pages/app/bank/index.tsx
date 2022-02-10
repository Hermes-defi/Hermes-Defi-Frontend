import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { displayNumber } from "libs/utils";
import { useToggle } from "react-use";
import { useBankStakeStats, useFetchStakePools, useMainBankStake } from "state/stake-bank";
import { BankPoolCard } from "components/cards/bank-card";

export function BankNavigation() {
  return (
    <Stack divider={<StackDivider borderColor="gray.200" />} direction="row" justify="center">
      <NextLink href="/app/bank" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">Bank</Heading>
          </Button>
        </a>
      </NextLink>

      <NextLink href="https://hermes-defi.gitbook.io/plutus/products/bank" passHref>
        <a>
          <Button variant="link" color={useColorModeValue("gray.500", "gray.300")}>
            <Heading fontSize="xl">Info</Heading>
          </Button>
        </a>
      </NextLink>
    </Stack>
  );
}


function BurnStats() {

  const stakeResp = useBankStakeStats();

  return (
    <Stack
      spacing={7}
      bg={useColorModeValue("white", "gray.700")}
      rounded="2xl"
      boxShadow="base"
      px={[5, 10]}
      py={6}
    >
      <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
        Bank Stats
      </Heading>

      <Stack spacing={[4, 2]}>
        <Stack direction={["column", "row"]} justify="space-between">
          <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
            Total $PLUTUS locked in bank
          </Heading>

          <Skeleton isLoaded={!stakeResp.isLoading}>
            <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
              {displayNumber(stakeResp.data?.plutusLockedString, false, 2)}
            </Text>
          </Skeleton>
        </Stack>

        <Stack direction={["column", "row"]} justify="space-between">
          <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
            % $PLUTUS locked in bank
          </Heading>
          <Skeleton isLoaded={!stakeResp.isLoading}>
            <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
              {displayNumber(stakeResp.data?.percentagePlutusLocked, false, 4)}%
            </Text>
          </Skeleton>
        </Stack>

        <Stack direction={["column", "row"]} justify="space-between">
          <Heading letterSpacing="1px" color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
            Total $PLUTUS locked value
          </Heading>
          <Skeleton isLoaded={!stakeResp.isLoading}>
            <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("primary.400", "primary.200")}>
              {displayNumber(stakeResp.data?.totalValueLocked, 
                false, 4)}$
            </Text>
          </Skeleton>
        </Stack>

      </Stack>
    </Stack>
  );
}

const Page: React.FC = () => {
  const [active, toggleActive] = useToggle(true);

  const stakeResp = useFetchStakePools();
  const mainPool = useMainBankStake();
  
  const isLoading = (stakeResp && stakeResp.every((s) => s.status === "loading")) ? true : false;
  const mainIsLoading = mainPool.status !== ("success")  ? true : false;
  console.log(mainIsLoading, mainPool.status);
  let pools = stakeResp ? stakeResp
    .filter((pool: any) => pool.data?.active === active) : null ; 

  return (
    <AppLayout>
      <Stack spacing={8}>
          <BankNavigation />
          <HStack pl={"3.5"} justify="center" divider={<StackDivider borderColor="gray.200" />}>
            <Button
              onClick={() => toggleActive()}
              color={
                active
                  ? useColorModeValue("gray.800", "gray.300")
                  : useColorModeValue("gray.500", "gray.500")
              }
              variant="link"
            >
              <Heading fontSize="xl">Active</Heading>
            </Button>

            <Button
              onClick={() => toggleActive()}
              color={
                !active
                  ? useColorModeValue("gray.800", "gray.300")
                  : useColorModeValue("gray.500", "gray.500")
              }
              variant="link"
            >
              <Heading fontSize="xl">Inactive</Heading>
            </Button>
          </HStack>
      </Stack>
      <HStack align="center" spacing={10} py={10}>
        <Container align="center" maxWidth="container.lg">
          
          {mainIsLoading ? (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            active ? <BankPoolCard stakePool={mainPool.data}/>
            :
            <></>
          )}
        </Container>
      </HStack>
        {pools ? (
        <Container align="center" maxWidth="container.lg">
          {isLoading ? (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            
            <Wrap justify="center" spacing="20px" w={"100%"}>
              {pools.map(({ data }: any) => (
                <WrapItem key={data.address}>
                  <BankPoolCard stakePool={data} />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Container>
        ) : <></>}
      <Container maxWidth="container.lg" my={8}>
      
            <BurnStats /> 
      </Container>
    </AppLayout>
  );
};

export default Page;

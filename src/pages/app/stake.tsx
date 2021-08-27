import React, { useReducer } from "react";

import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { useToggle } from "react-use";
import { useFetchStakePoolData } from "hooks/pools/queries";
import { useIrisPrice } from "hooks/prices";

import { StakeInfo, stakingPools } from "config/stake";
import { StakePoolContext, stakePoolsReducers } from "hooks/pools/reducer";

import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { StakePoolCard } from "components/stake-card";
import { AppLayout } from "components/layout";

const Page: React.FC = () => {
  const { data: irisPrice } = useIrisPrice();
  const { account } = useActiveWeb3React();
  const fetchPoolData = useFetchStakePoolData();

  // page display actions
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);

  const [state, dispatch] = useReducer(stakePoolsReducers, [] as StakeInfo[]);

  const poolQuery = useQuery(
    ["pools", account, irisPrice],

    async (): Promise<StakeInfo[]> => {
      return Promise.all(
        stakingPools.map(async (pool) => {
          return fetchPoolData(pool);
        })
      );
    },

    {
      enabled: !!irisPrice,

      onSuccess: (data) => {
        dispatch({ type: "ADD_POOLS", payload: data });
      },
    }
  );

  let pools = state
    .filter((pool) => pool.active === active)
    .filter((pool) => (stakedOnly ? pool.hasStaked === stakedOnly : true));

  return (
    <StakePoolContext.Provider value={[state, dispatch]}>
      <AppLayout>
        <Stack align="center" spacing={10} py={10}>
          <HStack spacing={14} align="center" justify="center">
            <FormControl w="auto" display="flex" alignItems="center">
              <Switch
                isChecked={stakedOnly}
                onChange={() => toggleStakedOnly()}
                id="staked-only"
                mt={1}
                mb={0}
                mr={3}
              />
              <FormLabel mr={0} mb={0} fontSize="md" htmlFor="staked-only">
                Staked Only
              </FormLabel>
            </FormControl>

            <HStack justify="center" divider={<StackDivider borderColor="gray.200" />}>
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
          </HStack>

          <Container align="center" maxWidth="container.lg">
            {poolQuery.isLoading && !poolQuery.data && (
              <Flex mt={16} align="center" justify="center">
                <Spinner size="xl" />
              </Flex>
            )}

            <SimpleGrid spacing="40px" alignItems="center" columns={[1, 3]}>
              {pools.map((pool) => (
                <StakePoolCard stakePool={pool} key={pool.address} />
              ))}
            </SimpleGrid>
          </Container>
        </Stack>
      </AppLayout>
    </StakePoolContext.Provider>
  );
};

export default Page;

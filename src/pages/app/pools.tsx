import React, { useEffect, useReducer, useState } from "react";
import { AppLayout } from "components/layout";
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
  useToast,
} from "@chakra-ui/react";
import { PoolCard } from "components/pool-card";
import { getPoolsData, PoolInfo } from "web3-functions";
import { PoolsContext, poolsReducers } from "hooks/pools-reducer";
import { useGetContract } from "hooks/wallet";
import { useActiveWeb3React } from "wallet";

const Page: React.FC = () => {
  const toast = useToast();
  const getContract = useGetContract();
  const [fetchingPools, setFetchingPools] = useState(false);
  const [state, dispatch] = useReducer(poolsReducers, [] as PoolInfo[]);
  const { account } = useActiveWeb3React();

  useEffect(() => {
    async function fetch() {
      setFetchingPools(true);

      try {
        const data = await getPoolsData({
          getContract,
          account,
          poolType: "pools",
        });

        dispatch({ type: "ADD_POOLS", payload: data });
      } catch (e) {
        toast({
          status: "error",
          title: "Error fetching pools",
          description: e.message,
          position: "top-right",
        });
      } finally {
        setFetchingPools(false);
      }
    }

    fetch();
  }, []);

  console.log("Did you fucking rerender?", state);
  return (
    <PoolsContext.Provider value={{ state, dispatch }}>
      <AppLayout>
        <Stack align="center" spacing={10} py={10}>
          <HStack spacing={14} align="center" justify="center">
            <FormControl w="auto" display="flex" alignItems="center">
              <Switch id="staked-only" mt={1} mb={0} mr={3} />
              <FormLabel mr={0} mb={0} fontSize="md" htmlFor="staked-only">
                Stacked Only
              </FormLabel>
            </FormControl>

            <HStack justify="center" divider={<StackDivider borderColor="gray.200" />}>
              <Button color="gray.800" variant="link">
                <Heading fontSize="xl">Active</Heading>
              </Button>

              <Button color="gray.500" variant="link">
                <Heading fontSize="xl">Inactive</Heading>
              </Button>
            </HStack>
          </HStack>

          <Container align="center" maxWidth="container.lg">
            {fetchingPools && (
              <Flex mt={16} align="center" justify="center">
                <Spinner size="xl" />
              </Flex>
            )}

            <SimpleGrid spacing="40px" alignItems="center" columns={[1, 3]}>
              {state.map((pool) => (
                <PoolCard pool={pool} key={pool.pid} />
              ))}
            </SimpleGrid>
          </Container>
        </Stack>
      </AppLayout>
    </PoolsContext.Provider>
  );
};

export default Page;

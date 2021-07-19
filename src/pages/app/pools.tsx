import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { usePoolsState, useFetchPoolInfoCb, PoolsContext, usePoolInfo } from "hooks/pools";
import { PoolCard } from "components/pool-card";

const PageBody: React.FC = () => {
  const { state, dispatch } = usePoolInfo();

  const [fetching, setFetching] = useState(false);
  const fetchPoolInfo = useFetchPoolInfoCb();

  useEffect(() => {
    if (fetching) return;

    setFetching(true);
    fetchPoolInfo().finally(() => setFetching(false));
  }, []);

  return (
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
          {fetching && (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          )}

          <SimpleGrid spacing="40px" alignItems="center" columns={[1, 3]}>
            {state.pools.map((pool) => (
              <PoolCard pool={pool} key={pool.pid} />
            ))}
          </SimpleGrid>
        </Container>
      </Stack>
    </AppLayout>
  );
};

const Page = () => {
  const value = usePoolsState("pools");

  return (
    <PoolsContext.Provider value={value}>
      <PageBody />
    </PoolsContext.Provider>
  );
};

export default Page;

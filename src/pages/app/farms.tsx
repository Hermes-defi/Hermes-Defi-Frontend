import React from "react";
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
import { getPoolData } from "web3-functions";
import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { useERC20, useMasterChef } from "hooks/contracts";
import { poolIds, PoolInfo } from "config/pools";
import { PoolsProvider, usePoolInfo } from "hooks/pools-reducer";

const Page: React.FC = () => {
  const toast = useToast();
  const getLpContract = useERC20();
  const masterChef = useMasterChef();
  const { account } = useActiveWeb3React();
  const [state, dispatch] = usePoolInfo();

  const farmQuery = useQuery(
    ["farms", account],

    async (): Promise<PoolInfo[]> => {
      return Promise.all(
        poolIds.map(async (pid) => {
          return getPoolData(pid, account, masterChef, getLpContract);
        })
      );
    },

    {
      onSuccess: (data) => {
        dispatch({ type: "ADD_POOLS", payload: data });
      },

      onError: ({ data, message }) => {
        toast({
          status: "error",
          position: "top-right",
          title: "Error fetching IRIS",
          description: data?.message || message,
        });
      },
    }
  );

  return (
    <PoolsProvider>
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
            {farmQuery.isLoading && (
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
    </PoolsProvider>
  );
};

export default Page;

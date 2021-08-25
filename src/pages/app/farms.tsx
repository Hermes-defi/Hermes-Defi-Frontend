import React, { useReducer } from "react";

import { useActiveWeb3React } from "wallet";
import { useQuery } from "react-query";
import { useToggle } from "react-use";
import { useFetchPoolData } from "hooks/pools/queries";
import { useIrisPrice } from "hooks/prices";

import { farmsDefaultData, PoolInfo } from "config/pools";
import { PoolsContext, poolsReducers } from "hooks/pools/reducer";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { PoolCard } from "components/pool-card";
import { AppLayout } from "components/layout";

const Page: React.FC = () => {
  const { account } = useActiveWeb3React();
  const { data: irisPrice } = useIrisPrice();
  const fetchPoolData = useFetchPoolData(irisPrice);

  // page display actions
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);

  const [state, dispatch] = useReducer(poolsReducers, [] as PoolInfo[]);

  const poolQuery = useQuery(
    ["farms", account, irisPrice],

    async (): Promise<PoolInfo[]> => {
      return Promise.all(
        farmsDefaultData.map(async (farm) => {
          return fetchPoolData(farm);
        })
      );
    },

    {
      enabled: !!irisPrice,

      onSuccess: (data) => {
        dispatch({ type: "ADD_POOLS", payload: data });
      },

      onError: ({ message, data }) => {
        // toast({
        //   status: "error",
        //   position: "top-right",
        //   title: "Error fetching pools",
        //   description: data?.message || message,
        //   isClosable: true,
        // });
      },
    }
  );

  let pools = state
    .filter((pool) => pool.active === active)
    .filter((pool) => (stakedOnly ? pool.hasStaked === stakedOnly : true));

  return (
    <PoolsContext.Provider value={[state, dispatch]}>
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
            {poolQuery.isLoading && (
              <Flex mt={16} align="center" justify="center">
                <Spinner size="xl" />
              </Flex>
            )}

            <Stack wrap="wrap" spacing="40px" direction="row" justify="center" alignItems="center">
              {pools.map((pool) => (
                <Box key={pool.pid} w={80} pt="40px">
                  <PoolCard pool={pool} key={pool.pid} />
                </Box>
              ))}
            </Stack>
          </Container>
        </Stack>
      </AppLayout>
    </PoolsContext.Provider>
  );
};

export default Page;

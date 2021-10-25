import React from "react";

import { useToggle } from "react-use";
import { useFetchPools } from "state/pools";

import {
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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { PoolCard } from "components/cards/pool-card";
import { AppLayout } from "components/layout";

const Page: React.FC = () => {
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);

  const poolsResp = useFetchPools();
  const isLoading = poolsResp.some((f) => f.status === "loading");

  let pools = poolsResp
    .filter((pool: any) => pool.data?.isActive === active)
    .filter((pool: any) => (stakedOnly ? pool.data?.hasStaked === stakedOnly : true));

  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={10}>
        <HStack spacing={14} align="center" justify="center">
          <FormControl w="auto" display="flex" alignItems="center">
            <Switch isChecked={stakedOnly} onChange={() => toggleStakedOnly()} id="staked-only" mt={1} mb={0} mr={3} />
            <FormLabel mr={0} mb={0} fontSize="md" htmlFor="staked-only">
              Staked Only
            </FormLabel>
          </FormControl>

          <HStack justify="center" divider={<StackDivider borderColor="gray.200" />}>
            <Button
              onClick={() => toggleActive()}
              color={active ? useColorModeValue("gray.800", "gray.300") : useColorModeValue("gray.500", "gray.500")}
              variant="link"
            >
              <Heading fontSize="xl">Active</Heading>
            </Button>

            <Button
              onClick={() => toggleActive()}
              color={!active ? useColorModeValue("gray.800", "gray.300") : useColorModeValue("gray.500", "gray.500")}
              variant="link"
            >
              <Heading fontSize="xl">Inactive</Heading>
            </Button>
          </HStack>
        </HStack>

        <Container align="center" maxWidth="container.xl">
          {isLoading ? (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Wrap justify="center" spacing="40px">
              {pools.map(({ data }: any) => (
                <WrapItem key={data.pid}>
                  <PoolCard key={data.pid} pool={data} />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

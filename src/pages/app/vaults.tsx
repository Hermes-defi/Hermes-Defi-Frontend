import React from "react";
import { useToggle } from "react-use";
import { useFetchVaults } from "state/vaults";

import { AppLayout } from "components/layout";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { VaultCard } from "components/cards/vault-card";

const Page: React.FC = () => {
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);

  const vaultsResp = useFetchVaults();
  const isLoading = vaultsResp.some((f) => f.status === "loading");

  let vaults = vaultsResp
    .filter((vault: any) => vault.data?.isActive === active)
    .filter((vault: any) => (stakedOnly ? vault.data?.hasStaked === stakedOnly : true));

  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={10}>
        <Stack direction={["column", "row"]} spacing={[4, 14]} align="center" justify="center">
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

          <Link
            href={`https://hermes-defi.gitbook.io/apollo/products/apollo-vaults-system`}
            textDecoration="underline"
            fontWeight="700"
            fontSize="sm"
            color="primary.400"
          >
            Click here learn more
          </Link>
        </Stack>

        <Container align="center" maxWidth="container.lg">
          {isLoading ? (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Wrap justify="center" spacing="40px">
              {vaults.map(({ data }: any) => (
                <WrapItem key={data.address}>
                  <VaultCard vault={data} />
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

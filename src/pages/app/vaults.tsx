import React, { useState } from "react";
import { fetchVaultsInfo } from "queries/vaults";
import { simpleRpcProvider } from "libs/providers";
import { useToggle } from "react-use";
import { useFetchVaults } from "state/vaults";
import { AppLayout } from "components/layout";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { VaultCard } from "components/cards/vault-card";

const Page = ({ vaults: initialVaults }) => {
  const [stakedOnly, toggleStakedOnly] = useToggle(false);
  const [active, toggleActive] = useToggle(true);
  const [walletBalance, toggleWalletBalance] = useToggle(false);
  const [platform, setPlatform] = useState("all");
  const [vaultType, setVaultType] = useState("all");
  const [asset, setAsset] = useState("all");
  const [order, setOrder] = useState("default");

  const vaultsResp = useFetchVaults({ initialVaults });
  const isLoading = vaultsResp.every((f) => f.status === "loading");

  const assets = vaultsResp.map((vault: any) => vault.data?.stakeToken.symbol);

  let vaults = vaultsResp
    .filter((vault: any) => vault.data?.isActive === active)
    .filter((vault: any) => (stakedOnly ? vault.data?.hasStaked === stakedOnly : true))
    .filter((vault: any) => (walletBalance ? vault.data?.hasWalletBalance === walletBalance : true))
    .filter((vault: any) => (platform !== "all" ? platform === vault.data?.amm : true))
    .filter((vault: any) => (vaultType !== "all" ? vaultType === vault.data?.vaultType : true))
    .filter((vault: any) => (asset !== "all" ? asset === vault.data?.stakeToken.symbol : true));

  if (order !== "default" && order === "apy") {
    vaults.sort((vault1: any, vault2: any) => {
      return vault1.data?.apy?.yearly < vault2.data?.apy?.yearly ? 1 : vault2.data?.apy?.yearly < vault1.data?.apy?.yearly ? -1 : 0;
    });
  }

  if (order !== "default" && order === "tvl") {
    vaults.sort((vault1: any, vault2: any) => {
      return vault1.data?.totalStaked * vault1.data?.stakeToken.price < vault2.data?.totalStaked * vault2.data?.stakeToken.price
        ? 1
        : vault2.data?.totalStaked * vault2.data?.stakeToken.price < vault1.data?.totalStaked * vault1.data?.stakeToken.price
        ? -1
        : 0;
    });
  }

  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={10}>
        <Stack spacing={[10, 10, 14]} align="center" justify="center" direction={["column", "column", "row"]}>
          <FormControl w="auto" display="flex" alignItems="center">
            <Switch isChecked={stakedOnly} onChange={() => toggleStakedOnly()} id="staked-only" mt={1} mb={0} mr={3} />
            <FormLabel mr={0} mb={0} fontSize="md" htmlFor="staked-only">
              Staked Only
            </FormLabel>
          </FormControl>

          <FormControl w="auto" display="flex" alignItems="center">
            <Switch isChecked={walletBalance} onChange={() => toggleWalletBalance()} id="wallet-balance" mt={1} mb={0} mr={3} />
            <FormLabel mr={0} mb={0} fontSize="md" htmlFor="wallet-balance">
              Hide Zero Balance
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
        </Stack>

        {/* Filter Bar */}
        <Box
          px={10}
          py={4}
          w={["20rem", "30rem", "100%", "60rem", "70rem"]}
          bg="secondary.500"
          boxShadow="rgb(84 158 171 / 45%) 0px 25px 50px -12px"
          rounded="3xl"
          color="white"
        >
          <Stack direction={["column", "row", "row"]} justify={"space-between"} mb={"3"}>
            <Stack mb="3" boxShadow="md" rounded={"lg"}>
              <Button
                bg={"secondary.400"}
                size={"sm"}
                onClick={() => {
                  setPlatform("all");
                  setVaultType("all");
                  setAsset("all");
                  setOrder("default");
                }}
              >
                Clear Filter
              </Button>
            </Stack>

            <Stack mb="3" justify={"normal"}>
              <Badge boxShadow="md" px={2} rounded="lg" bg={"gray.400"} color="white" alignSelf={"center"}>
                Lowest fees in harmony
              </Badge>
            </Stack>
          </Stack>

          <Stack align="center" direction={["column", "row"]} spacing={10} justify={"space-around"}>
            <Stack w="xs" px={[10, 0]} mt={[3, 0]}>
              <Badge w="fit-content" boxShadow="md" px={2} rounded="lg" colorScheme="gray">
                Platform
              </Badge>
              <Select variant="flushed" onChange={(v) => setPlatform(v.target.value)} value={platform}>
                <option key="allPlatform" value="all">
                  All
                </option>
                <option key="sushiswap" value="sushiswap">
                  Sushiswap
                </option>
              </Select>
            </Stack>
            <Stack w="xs" px={[10, 0]}>
              <Badge w="fit-content" boxShadow="md" px={2} rounded="lg" colorScheme="gray">
                Vault Type
              </Badge>
              <Select variant="flushed" onChange={(v) => setVaultType(v.target.value)} value={vaultType}>
                <option key="allVault" value="all">
                  All
                </option>
                <option key="stable" value="stable">
                  Stable LPs
                </option>
                <option key="lp" value="lp">
                  LPs
                </option>
              </Select>
            </Stack>
            <Stack w="xs" px={[10, 0]}>
              <Badge w="fit-content" boxShadow="md" px={2} rounded="lg" colorScheme="gray">
                Asset
              </Badge>
              <Select variant="flushed" onChange={(v) => setAsset(v.target.value)} value={asset}>
                <option key="allAsset" value={"all"}>
                  All
                </option>
                {isLoading ? (
                  <></>
                ) : (
                  <>
                    {assets.map((data: any) => (
                      <option key={data} value={data}>
                        {data}
                      </option>
                    ))}
                  </>
                )}
              </Select>
            </Stack>
            <Stack w="xs" px={[10, 0]}>
              <Badge w="fit-content" boxShadow="md" px={2} rounded="lg" colorScheme="gray">
                Sort By
              </Badge>
              <Select variant="flushed" onChange={(v) => setOrder(v.target.value)} value={order}>
                <option key="default" value="default">
                  Default
                </option>
                <option key="apy" value="apy">
                  APY
                </option>
                <option key="tvl" value="tvl">
                  TVL
                </option>
              </Select>
            </Stack>
          </Stack>
        </Box>

        <Container align="center" maxWidth="container.xl">
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

export async function getStaticProps() {
  await simpleRpcProvider.ready;
  const vaults = await fetchVaultsInfo(simpleRpcProvider);

  return {
    props: { vaults },

    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 30, // In seconds
  };
}

export default Page;

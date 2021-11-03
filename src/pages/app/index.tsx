import React from "react";

import defaultContracts from "config/contracts";

import { addTokenToWallet } from "wallet/utils";
import { blockDiff, displayCurrency, displayNumber, displayTokenCurrency, generateTimeDuration } from "libs/utils";
import {
  useFarmAPRStats,
  usePoolsAPRStats,
  useTotalInBalancers,
  useTotalInFarms,
  useTotalInPools,
  useHarvestAll,
  useApolloData,
  useApolloStats,
  useTvlChart,
  useTotalInVaults,
} from "hooks/home-page";

import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiFarmTractor } from "react-icons/gi";
import { RiWaterFlashFill } from "react-icons/ri";
import { ResponsiveContainer, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { apolloPerBlock } from "config/constants";
import { useCurrentBlockNumber } from "hooks/wallet";

const Page: React.FC = () => {
  const currentBlock = useCurrentBlockNumber();

  const apolloStats = useApolloStats();
  const farmStats = useTotalInFarms();
  const balStats = useTotalInBalancers();
  const poolStats = useTotalInPools();
  const vaultStats = useTotalInVaults();

  const [isFarmAprLoading, farmApr] = useFarmAPRStats();
  const [isPoolAprLoading, poolApr] = usePoolsAPRStats();

  const { apolloInWallet, apolloToHarvest } = useApolloData();
  const chartData = useTvlChart();

  const harvestAll = useHarvestAll(apolloToHarvest.data);

  return (
    <AppLayout>
      <Stack spacing={10} py={10}>
        <Stack direction={["column", "row"]} justify="space-between" spacing={10}>
          <Box flex="1" bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" w="100%">
              More about Hermes Heroes
            </Heading>
            <Box
              as="iframe"
              title="More about Hermes Heroes"
              src="https://www.youtube.com/embed/mpu6R0ECiI8"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              w="100%"
              h="100%"
              py={[5, 10]}
            />
          </Box>
          <Box flex="1" bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" w="100%">
              How Apollo system works
            </Heading>
            <Box
              as="iframe"
              title="How Apollo system works"
              src="https://www.youtube.com/embed/UGowzJ8kyIo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              w="100%"
              h="100%"
              py={[5, 10]}
            />
          </Box>
        </Stack>

        <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl">
            Farms and Pools
          </Heading>

          <Stack direction={["column", "row"]} justify="space-between" spacing={[5, 10]}>
            <Stack mt={10} align="stretch" spacing={10}>
              <Stack spacing={4} justify={["center", ""]} align="center" direction="row">
                <Image src="/apollo-logo.png" boxSize={12} />
                <Button
                  onClick={() => addTokenToWallet(defaultContracts.apolloToken.address, "APOLLO")}
                  colorScheme="secondary"
                  size="sm"
                >
                  + Add APOLLO to Wallet
                </Button>
              </Stack>

              <Stack justify={["center", ""]} direction="row" spacing={10}>
                <Box align="center">
                  <Skeleton isLoaded={!!apolloToHarvest.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(apolloToHarvest.data, "", true)}
                    </Text>
                  </Skeleton>

                  <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.200")}>
                    APOLLO to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Skeleton isLoaded={!!apolloInWallet.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(apolloInWallet.data, "", true)}
                    </Text>
                  </Skeleton>
                  <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.200")}>
                    APOLLO in wallet
                  </Text>
                </Box>
              </Stack>

              <Button
                isLoading={harvestAll.isLoading}
                onClick={() => harvestAll.mutate()}
                rounded="xl"
                colorScheme="primary"
                fontSize="md"
              >
                Harvest All
              </Button>
            </Stack>

            <Stack spacing={[5, 14]} direction={{ base: "column", md: "row" }}>
              <Stack
                boxShadow="rgb(190 157 65 / 45%) 0px 25px 50px -12px"
                rounded="3xl"
                bg="secondary.500"
                bgGradient="linear(to-t, secondary.500, primary.200)"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
                as={Link}
                href="/app/farms"
                textDecoration="none!important"
              >
                <div>
                  <Center display={["none", "flex"]} mb={3} rounded="2xl" bg="white" p={3}>
                    <Icon color="secondary.500" boxSize={8} as={GiFarmTractor} />
                  </Center>

                  <Text fontSize={["lg", "sm"]} fontWeight={["500"]}>
                    In Farms
                  </Text>
                </div>

                <Box>
                  <Text fontSize={["xl", "sm"]} fontWeight="700">
                    Earn Upto
                  </Text>
                  <Skeleton isLoaded={!isFarmAprLoading}>
                    <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                      {displayNumber(farmApr as number, true)}%
                    </Text>{" "}
                  </Skeleton>
                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>

              <Stack
                boxShadow="rgb(179 142 89 / 45%) 0px 25px 50px -12px"
                rounded="3xl"
                bg="accent.500"
                bgGradient="linear(to-t, secondary.500, accent.300)"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
                as={Link}
                href="/app/pools"
                textDecoration="none!important"
              >
                <div>
                  <Center display={["none", "flex"]} mb={3} rounded="2xl" bg="white" p={3}>
                    <Icon color="#B38E5A" boxSize={8} as={RiWaterFlashFill} />
                  </Center>

                  <Text fontSize={["lg", "sm"]} fontWeight={["500", "700"]}>
                    In Pools
                  </Text>
                </div>

                <Box>
                  <Text fontSize={["xl", "sm"]} fontWeight="700">
                    Earn Upto
                  </Text>
                  <Skeleton isLoaded={!isPoolAprLoading}>
                    <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                      {displayNumber(poolApr as number, true)}%
                    </Text>{" "}
                  </Skeleton>

                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl">
            Apollo stats
          </Heading>

          <Stack mt={[6, 0]} direction={["column-reverse", "row"]} spacing={10}>
            <SimpleGrid columns={2} mt={[0, 10]} spacing={["20px", "30px"]}>
              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(apolloStats.data?.marketCap)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.200")} fontSize="md">
                    Market Cap
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayTokenCurrency(apolloStats.data?.maximumSupply, "")}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.200")} fontSize="md">
                    Maximum Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(apolloPerBlock, false, 1)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    New apollo/block
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(apolloStats.data?.totalMinted)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    Total Minted
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(apolloStats.data?.circulatingSupply)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    Circulating Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!apolloStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(apolloStats.data?.totalBurned, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    Total Burned
                  </Heading>
                </Box>
              </Box>
            </SimpleGrid>

            <Box flex="1">
              <Stack
                mb={5}
                align={["flex-start", "center"]}
                justify="space-between"
                direction={["column", "row"]}
                spacing={[6, 0]}
                ml={[0, 12]}
              >
                <div>
                  <Heading
                    borderBottomWidth="2px"
                    borderColor="primary.500"
                    mb={[0, 1]}
                    color={useColorModeValue("gray.600", "gray.300")}
                    fontSize="xl"
                  >
                    Total Value Locked
                  </Heading>
                  <Skeleton
                    isLoaded={
                      !farmStats.isLoading && !poolStats.isLoading && !balStats.isLoading && !vaultStats.isLoading
                    }
                  >
                    <Text fontSize="3xl" fontWeight="700">
                      {displayCurrency(
                        farmStats.data.plus(poolStats.data).plus(balStats.data).plus(vaultStats.data).toNumber()
                      )}
                    </Text>
                  </Skeleton>
                </div>

                <Stack spacing={[5, 10]} direction={["column", "row"]}>
                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color={useColorModeValue("gray.600", "gray.300")}
                      fontSize="xl"
                    >
                      Vaults
                    </Heading>
                    <Skeleton isLoaded={!vaultStats.isLoading}>
                      <Text fontSize="2xl" fontWeight="700">
                        {displayCurrency(vaultStats.data.toNumber())}
                      </Text>
                    </Skeleton>
                  </Box>

                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color={useColorModeValue("gray.600", "gray.300")}
                      fontSize="xl"
                    >
                      Farms
                    </Heading>
                    <Skeleton isLoaded={!farmStats.isLoading}>
                      <Text fontSize="2xl" fontWeight="700">
                        {displayCurrency(farmStats.data.toNumber())}
                      </Text>
                    </Skeleton>
                  </Box>

                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color={useColorModeValue("gray.600", "gray.300")}
                      fontSize="xl"
                    >
                      Pools
                    </Heading>
                    <Skeleton isLoaded={!poolStats.isLoading}>
                      <Text fontSize="2xl" fontWeight="700">
                        {displayCurrency(poolStats.data.toNumber())}
                      </Text>
                    </Skeleton>
                  </Box>
                </Stack>
              </Stack>

              <ResponsiveContainer
                width={useBreakpointValue({ base: "100%", md: 800 })}
                height={useBreakpointValue({ base: 340, md: "80%" })}
              >
                <LineChart style={{ marginLeft: useBreakpointValue({ base: "-30px", md: 0 }) }} data={chartData.data}>
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                  <CartesianGrid stroke={useColorModeValue("#ccc", "#555")} strokeDasharray="5 5" />
                  <XAxis style={{ fontSize: "12px" }} dataKey="time" />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </AppLayout>
  );
};

export default Page;

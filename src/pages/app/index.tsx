import React from "react";

import defaultContracts from "config/contracts";

import { addTokenToWallet } from "wallet/utils";
import { displayCurrency, displayNumber, displayTokenCurrency } from "libs/utils";
import {
  useAPRStats,
  useHarvestAll,
  useHermesStats,
  useIrisData,
  useIrisStats,
  useTvlChart,
} from "hooks/home";

import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GiFarmTractor } from "react-icons/gi";
import { RiWaterFlashFill } from "react-icons/ri";
import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Page: React.FC = () => {
  const irisStats = useIrisStats();
  const hermesStats = useHermesStats();

  const { maxPoolAPR, maxFarmAPR } = useAPRStats();
  const { irisInWallet, irisToHarvest } = useIrisData();
  const chartData = useTvlChart();

  const harvestAll = useHarvestAll(irisToHarvest.data);

  return (
    <AppLayout>
      <Stack spacing={10} py={10}>
        <Box bg="white" rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color="gray.600" fontSize="xl">
            Farms and Pools
          </Heading>

          <SimpleGrid templateColumns={{ base: "1fr", md: "1fr 1fr 2fr" }} spacing={[5, 10]}>
            <Stack mt={10} align="stretch" spacing={10}>
              <Stack spacing={4} justify={["center", ""]} align="center" direction="row">
                <Image src="/hermes-logo-1.png" boxSize={12} />
                <Button
                  onClick={() => addTokenToWallet(defaultContracts.irisToken.address, "IRIS")}
                  bg="secondary.200"
                  _hover={{ bg: "secondary.100" }}
                  size="sm"
                >
                  + Add IRIS to Wallet
                </Button>
              </Stack>

              <Stack justify={["center", ""]} direction="row" spacing={10}>
                <Box align="center">
                  <Skeleton isLoaded={!!irisToHarvest.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(irisToHarvest.data, "", true)}
                    </Text>
                  </Skeleton>

                  <Text fontSize={"sm"} color="gray.600">
                    IRIS to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Skeleton isLoaded={!!irisInWallet.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(irisInWallet.data, "", true)}
                    </Text>
                  </Skeleton>
                  <Text fontSize={"sm"} color="gray.600">
                    IRIS in wallet
                  </Text>
                </Box>
              </Stack>

              <Button
                isLoading={harvestAll.isLoading && !harvestAll.isSuccess}
                onClick={() => harvestAll.mutate()}
                rounded="xl"
                colorScheme="primary"
                fontSize="md"
              >
                Harvest All
              </Button>
            </Stack>

            <Box />

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
                  <Skeleton isLoaded={!!maxFarmAPR.data}>
                    <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                      {displayNumber(Math.round(maxFarmAPR.data), true)}%
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
                bgGradient="linear(to-t, accent.500, primary.200)"
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
                  <Skeleton isLoaded={!!maxPoolAPR.data}>
                    <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                      {displayNumber(Math.round(maxPoolAPR.data), true)}%
                    </Text>{" "}
                  </Skeleton>

                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Box>

        <Box bg="white" rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color="gray.600" fontSize="xl">
            IRIS stats
          </Heading>

          <Stack mt={[6, 0]} direction={["column-reverse", "row"]} spacing={10}>
            <SimpleGrid columns={2} mt={[0, 10]} spacing={["20px", "30px"]}>
              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(irisStats.data?.marketCap)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Market Cap
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayTokenCurrency(irisStats.data?.maximumSupply, "")}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Maximum Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber("0.4")}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    New IRIS/block
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(irisStats.data?.totalMinted)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Total Minted
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(irisStats.data?.circulatingSupply)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
                    Circulating Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!irisStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(irisStats.data?.totalBurned, true)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color="gray.600" fontSize="md">
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
                ml={12}
              >
                <div>
                  <Heading
                    borderBottomWidth="2px"
                    borderColor="primary.500"
                    mb={[0, 1]}
                    color="gray.600"
                    fontSize="xl"
                  >
                    Total Value Locked
                  </Heading>
                  <Skeleton isLoaded={!!hermesStats.data}>
                    <Text fontSize="3xl" fontWeight="700">
                      {displayCurrency(hermesStats.data?.tvl)}
                    </Text>
                  </Skeleton>
                </div>

                <Stack spacing={[5, 10]} direction="row">
                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color="gray.600"
                      fontSize="xl"
                    >
                      Farms
                    </Heading>
                    <Skeleton isLoaded={!!hermesStats.data}>
                      <Text fontSize="2xl" fontWeight="700">
                        {displayCurrency(hermesStats.data?.totalValueInFarms)}
                      </Text>
                    </Skeleton>
                  </Box>

                  <Box align={["left", "center"]}>
                    <Heading
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      mb={1}
                      color="gray.600"
                      fontSize="xl"
                    >
                      Pools
                    </Heading>
                    <Skeleton isLoaded={!!hermesStats.data}>
                      <Text fontSize="2xl" fontWeight="700">
                        {displayCurrency(hermesStats.data?.totalValueInPools)}
                      </Text>
                    </Skeleton>
                  </Box>
                </Stack>
              </Stack>

              <ResponsiveContainer width={useBreakpointValue({ base: 340, md: 800 })} height="80%">
                <LineChart
                  style={{ marginLeft: useBreakpointValue({ base: "-30px", md: 0 }) }}
                  data={chartData.data}
                >
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis style={{ fontSize: "12px" }} dataKey="time" />
                  <YAxis
                    style={{ fontSize: "12px" }}
                    domain={[
                      Math.min(...(chartData.data || []).map((d: any) => d.value)) - 10000,
                      Math.max(...(chartData.data || []).map((d: any) => d.value)) + 10000,
                    ]}
                  />
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

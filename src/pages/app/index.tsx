import React from "react";

import defaultContracts from "config/contracts";

import dayjs from "dayjs";
import { addTokenToWallet } from "wallet/utils";
import { blockDiff, displayCurrency, displayNumber, displayTokenCurrency, generateTimeDuration } from "libs/utils";
import {
  useFarmAPRStats,
  usePoolsAPRStats,
  useTotalInBalancers,
  useTotalInFarms,
  useTotalInPools,
  useHarvestAll,
  usePlutusData,
  usePlutusStats,
  useTvlChart,
  useTotalInVaults,
  useTotalInBank,
} from "hooks/home-page";

import { AppLayout } from "components/layout";
import {
  AspectRatio,
  Badge,
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
import { useCurrentBlockNumber } from "hooks/wallet";

const calculateFarmingTimeLeft = () => {
  let difference = +dayjs("2022-02-21 23:00", "YYYY-MM-DD HH:mm").toDate() - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }

  return timeLeft;
};

function useFarmingTimeLeft() {
  const [timeLeft, setTimeLeft] = React.useState(calculateFarmingTimeLeft());

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateFarmingTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  let timerComponents: any = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return timerComponents;
}

const Page: React.FC = () => {
  const plutusStats = usePlutusStats();
  const farmStats = useTotalInFarms();
  const balStats = useTotalInBalancers();
  const poolStats = useTotalInPools();
  const vaultStats = useTotalInVaults();
  const bankStats = useTotalInBank();
  const currentBlock = useCurrentBlockNumber();
  const timerComponents = useFarmingTimeLeft();

  const [isFarmAprLoading, farmApr] = useFarmAPRStats();
  const [isPoolAprLoading, poolApr] = usePoolsAPRStats();

  const { plutusInWallet, plutusToHarvest } = usePlutusData();
  const chartData = useTvlChart();

  const harvestAll = useHarvestAll(plutusToHarvest.data);

  return (
    <AppLayout>
      <Stack spacing={10} py={10}>
        <Stack direction={["column", "row"]} justify="center" spacing={10}>
          <Box align="center" w="100%" bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
            <Heading align="center" color={useColorModeValue("primary.600", "accent.200")} fontSize="2xl">
              Layer 2 Farming ends
            </Heading>

            <Badge mt={"3"} colorScheme="secondary" fontSize="2xl" size="2xl" py={2} px={10} rounded="xl">
              <Text align="center" letterSpacing="1px" fontWeight="700">
                {timerComponents}
              </Text>
            </Badge>
            <Heading mt={"3"} align="center" color={useColorModeValue("primary.600", "accent.200")} fontSize="2xl">
              Get ready for Hermes Protocol
            </Heading>
          </Box>
        </Stack>

        <HStack spacing="10">
          <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6} w="50%">
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" w="100%">
              The Hermes Protocol In Two Minutes
            </Heading>
            <AspectRatio maxH="lg" ratio={16 / 9}>
              <iframe
                title="The Hermes Protocol In Two Minutes"
                src="https://www.youtube.com/embed/jbbtoci9cdg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </Box>
          <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="base" px={[5, 10]} py={6} w="50%">
            <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl" w="100%">
              Tranquility City AMA
            </Heading>
            <AspectRatio maxH="lg" ratio={16 / 9}>
              <iframe
                title="Tranquility City x Hermes DeFi - AMA"
                src="https://www.youtube.com/embed/688x_Ritbjk"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </Box>
        </HStack>
        <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="2xl" px={[5, 10]} py={6}>
          <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl">
            Farms and Pools
          </Heading>

          <SimpleGrid templateColumns={{ base: "1fr", md: "1fr 1fr 2fr" }} spacing={[5, 10]}>
            <Stack mt={10} align="stretch" spacing={10}>
              <Stack spacing={4} justify={["center", ""]} align="center" direction="row">
                <Image src="/plutus-logo.png" boxSize={12} />
                <Button onClick={() => addTokenToWallet(defaultContracts.plutusToken.address, "PLUTUS")} colorScheme="secondary" size="sm">
                  + Add PLUTUS to Wallet
                </Button>
              </Stack>

              <Stack justify={["center", ""]} direction="row" spacing={10}>
                <Box align="center">
                  <Skeleton isLoaded={!!plutusToHarvest.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(plutusToHarvest.data, "", true)}
                    </Text>
                  </Skeleton>

                  <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.200")}>
                    PLUTUS to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Skeleton isLoaded={!!plutusInWallet.data}>
                    <Text mb={2} fontWeight="700" fontSize="2xl">
                      {displayTokenCurrency(plutusInWallet.data, "", true)}
                    </Text>
                  </Skeleton>
                  <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.200")}>
                    PLUTUS in wallet
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
                boxShadow="rgb(251 182 206 / 30%) 0px 25px 25px -12px"
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
                    <Icon color="secondary.300" boxSize={8} as={GiFarmTractor} />
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
                      {farmApr ? `${displayNumber(farmApr as number, true)}%` : "N/A"}
                    </Text>{" "}
                  </Skeleton>
                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>

              <Stack
                boxShadow="rgb(251 182 206 / 30%) 0px 25px 25px -12px"
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
                    <Icon color="secondary.300" boxSize={8} as={RiWaterFlashFill} />
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
                      {poolApr ? `${displayNumber(poolApr as number, true)}%` : "N/A"}
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

        <Box bg={useColorModeValue("white", "gray.700")} rounded="2xl" boxShadow="2xl" px={[5, 10]} py={6}>
          <Heading color={useColorModeValue("gray.600", "gray.200")} fontSize="xl">
            PLUTUS stats
          </Heading>

          <Stack mt={[6, 0]} direction={["column-reverse", "row"]} spacing={10}>
            <SimpleGrid columns={2} mt={[0, 10]} spacing={["20px", "30px"]}>
              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayCurrency(plutusStats.data?.marketCap, false, 0)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.200")} fontSize="md">
                    Market Cap
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayTokenCurrency(plutusStats.data?.maximumSupply, "")}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.200")} fontSize="md">
                    Maximum Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(plutusStats.data?.plutusPerBlock, false, 2)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    New PLUTUS/block
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(plutusStats.data?.totalMinted)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    Total Minted
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(plutusStats.data?.circulatingSupply)}
                    </Text>
                  </Skeleton>
                  <Heading mt={1} color={useColorModeValue("gray.600", "gray.300")} fontSize="md">
                    Circulating Supply
                  </Heading>
                </Box>
              </Box>

              <Box align={["left", "center"]}>
                <Box pl={3} borderLeftWidth="3px" borderColor="primary.500">
                  <Skeleton isLoaded={!!plutusStats.data}>
                    <Text fontSize="lg" fontWeight="700">
                      {displayNumber(plutusStats.data?.totalBurned, true)}
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
                  <Skeleton isLoaded={!farmStats.isLoading && !poolStats.isLoading}>
                    <Text fontSize="3xl" fontWeight="700">
                      {displayCurrency(farmStats.data.plus(poolStats.data).plus(vaultStats.data).plus(bankStats.data).toNumber(), false, 0)}
                    </Text>
                  </Skeleton>
                </div>

                <Stack spacing={[2, 5]} direction={["column", "row"]}>
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
                    <Skeleton isLoaded={!farmStats.isLoading}>
                      <Text fontSize="xl" fontWeight="700">
                        {displayCurrency(vaultStats.data.toNumber(), false, 0)}
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
                      <Text fontSize="xl" fontWeight="700">
                        {displayCurrency(farmStats.data.toNumber(), false, 0)}
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
                      <Text fontSize="xl" fontWeight="700">
                        {displayCurrency(poolStats.data.toNumber(), false, 0)}
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
                      Bank
                    </Heading>
                    <Skeleton isLoaded={!poolStats.isLoading}>
                      <Text fontSize="xl" fontWeight="700">
                        {displayCurrency(bankStats.data.toNumber(), false, 0)}
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
                  <YAxis
                    style={{ fontSize: "12px" }}
                    domain={[
                      Math.min(...(chartData.data || []).map((d: any) => d.value)) - 100000,
                      Math.max(...(chartData.data || []).map((d: any) => d.value)) + 100000,
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

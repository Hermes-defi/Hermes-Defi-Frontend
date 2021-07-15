import React from "react";
import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GiFarmTractor } from "react-icons/gi";
import { RiWaterFlashFill } from "react-icons/ri";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 200, pv: 2300, amt: 2800 },
  { name: "Page C", uv: 600, pv: 2200, amt: 3200 },
  { name: "Page D", uv: 800, pv: 2100, amt: 2300 },
  { name: "Page E", uv: 400, pv: 2000, amt: 2900 },
];

const Page: React.FC = () => {
  return (
    <AppLayout>
      <Stack spacing={10} py={10}>
        <Box bg="white" rounded="2xl" boxShadow="base" px={[5, 10]} py={6}>
          <Heading color="gray.600" fontSize="xl">
            Farms and Pools
          </Heading>

          <SimpleGrid templateColumns={{ base: "1fr", md: "1fr 1fr 2fr" }} spacing={[5, 10]}>
            <Stack mt={10} align="stretch" spacing={10}>
              <Stack spacing={4} align="center" direction="row">
                <Image src="/hermes-logo-1.png" boxSize={12} />
                <Button bg="secondary.200" _hover={{ bg: "secondary.100" }} size="sm">
                  + Add IRIS to Wallet
                </Button>
              </Stack>

              <Stack direction="row" spacing={10}>
                <Box align="center">
                  <Text mb={2} fontWeight="700" fontSize="2xl">
                    $0.00
                  </Text>
                  <Text fontSize={"sm"} color="gray.600">
                    IRIS to harvest
                  </Text>
                </Box>

                <Box align="center">
                  <Text mb={2} fontWeight="700" fontSize="2xl">
                    $0.00
                  </Text>
                  <Text fontSize={"sm"} color="gray.600">
                    IRIS in wallet
                  </Text>
                </Box>
              </Stack>

              <Button variant="primary" fontSize="md">
                Harvest All
              </Button>
            </Stack>

            <Box />

            <Stack spacing={[5, 14]} direction={{ base: "column", md: "row" }}>
              <Stack
                boxShadow="xl"
                rounded="3xl"
                bg="secondary.500"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
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
                  <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                    99.9%{" "}
                  </Text>
                  <Text display={["inline", "block"]} fontSize="2xl" fontFamily="heading">
                    APR
                  </Text>
                </Box>
              </Stack>

              <Stack
                boxShadow="xl"
                rounded="3xl"
                bg="#B38E5A"
                color="white"
                justify="space-between"
                px={8}
                py={7}
                pr={[14, 28]}
              >
                <div>
                  <Center display={["none", "flex"]} mb={3} rounded="2xl" bg="white" p={3}>
                    <Icon color="secondary.500" boxSize={8} as={RiWaterFlashFill} />
                  </Center>

                  <Text fontSize={["lg", "sm"]} fontWeight={["500", "700"]}>
                    In Pools
                  </Text>
                </div>

                <Box>
                  <Text fontSize={["xl", "sm"]} fontWeight="700">
                    Earn Upto
                  </Text>
                  <Text display={["inline", "block"]} fontWeight="900" fontSize={["3xl", "2xl"]}>
                    99.9%{" "}
                  </Text>
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
                <Text fontSize="lg" fontWeight="700">
                  $21,803,359
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  Market Cap
                </Heading>
              </Box>

              <Box align={["left", "center"]}>
                <Text fontSize="lg" fontWeight="700">
                  $21,803,359
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  Maximum Supply
                </Heading>
              </Box>

              <Box align={["left", "center"]}>
                <Text fontSize="lg" fontWeight="700">
                  0.8
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  New IRIS/block
                </Heading>
              </Box>

              <Box align={["left", "center"]}>
                <Text fontSize="lg" fontWeight="700">
                  2,463,180
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  Total Minted
                </Heading>
              </Box>

              <Box align={["left", "center"]}>
                <Text fontSize="lg" fontWeight="700">
                  2,463,180
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  Circulating Supply
                </Heading>
              </Box>

              <Box align={["left", "center"]}>
                <Text fontSize="lg" fontWeight="700">
                  2,463,180
                </Text>
                <Heading mt={1} color="gray.600" fontSize="lg">
                  Total Burned
                </Heading>
              </Box>
            </SimpleGrid>

            <Box flex="1">
              <Stack
                mb={10}
                align={["flex-start", "center"]}
                justify="space-between"
                direction={["column", "row"]}
                spacing={[6, 0]}
              >
                <div>
                  <Heading mb={[0, 2]} color="gray.600" fontSize="xl">
                    Total Value Locked
                  </Heading>
                  <Text fontSize="3xl" fontWeight="700">
                    $133,580,600.96
                  </Text>
                </div>

                <Stack spacing={[5, 10]} direction="row">
                  <Box align={["left", "center"]}>
                    <Heading mb={1} color="gray.600" fontSize="xl">
                      Farms
                    </Heading>
                    <Text fontSize="xl" fontWeight="700">
                      $115,733,738
                    </Text>
                  </Box>

                  <Box align={["left", "center"]}>
                    <Heading mb={1} color="gray.600" fontSize="xl">
                      Pools
                    </Heading>
                    <Text fontSize="xl" fontWeight="700">
                      $115,733,738
                    </Text>
                  </Box>
                </Stack>
              </Stack>

              <Box>
                <LineChart
                  width={useBreakpointValue({ base: 340, md: 800 })}
                  height={useBreakpointValue({ base: 200, md: 300 })}
                  style={{ marginLeft: useBreakpointValue({ base: "-30px", md: 0 }) }}
                  data={data}
                >
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </AppLayout>
  );
};

export default Page;

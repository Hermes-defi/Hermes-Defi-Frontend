import React from "react";
import { AppLayout } from "components/layout";
import {
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Stack,
  StackDivider,
  Switch,
  Text,
} from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";

const Page: React.FC = () => {
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
            <Button color="gray.500" variant="link">
              <Heading fontSize="xl">Active</Heading>
            </Button>

            <Button color="gray.800" variant="link">
              <Heading fontSize="xl">Inactive</Heading>
            </Button>
          </HStack>
        </HStack>

        <Container align="center" maxWidth="container.lg">
          <SimpleGrid spacing="40px" alignItems="center" columns={3}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box key={i} px={8} py={4} boxShadow="lg" rounded="3xl" bg="#B38E5A" color="white">
                <HStack mb={5} spacing={6}>
                  {/* images */}
                  <Box w="56px">
                    <Box float="left">
                      <Image src="/hermes-logo-1.png" boxSize="30px" />
                    </Box>
                    <Box float="right">
                      <Image src="/matic.svg" boxSize="30px" />
                    </Box>
                  </Box>

                  {/* name */}
                  <Heading>IRIS - Matic</Heading>
                </HStack>

                <HStack mb={8} spacing={4}>
                  <Badge px={2} rounded="lg" colorScheme="gray">
                    50x
                  </Badge>
                  <Badge px={2} rounded="lg" colorScheme="green">
                    No Fees
                  </Badge>
                  <Badge px={2} rounded="lg" colorScheme="blue">
                    Quickswap
                  </Badge>
                </HStack>

                <Stack mb={8}>
                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      APY
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      1,717.27%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      APR
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      290.65%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      Earn
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      IRIS
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      Deposit Fee
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      0%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      IRIS Earned ~$0.00
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      0
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      IRIS-MATIC LP Staked ~$0.00
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      0
                    </Text>
                  </Stack>
                </Stack>

                <Stack mb={8} align="center">
                  <Button isFullWidth rightIcon={<FiLock />} colorScheme="primary">
                    Lock
                  </Button>
                  <Button isFullWidth bg="gray.700" _hover={{ bg: "gray.600" }}>
                    Harvest
                  </Button>
                </Stack>

                <Box align="left">
                  <Heading mb={3} fontSize="xl">
                    Details
                  </Heading>

                  <Stack mb={5}>
                    <Stack direction="row" justify="space-between">
                      <Text fontWeight="700" fontSize="sm">
                        Deposit
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        IRIS-MATIC LP
                      </Text>
                    </Stack>

                    <Stack direction="row" justify="space-between">
                      <Text fontWeight="700" fontSize="sm">
                        Total Liquidity
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        $4,763,463
                      </Text>
                    </Stack>

                    <Stack direction="row" justify="space-between">
                      <Text fontWeight="700" fontSize="sm">
                        My Liquidity
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        $0
                      </Text>
                    </Stack>
                  </Stack>

                  <Link textDecoration="underline" href="#" fontWeight="700" fontSize="sm">
                    View on Matic
                  </Link>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

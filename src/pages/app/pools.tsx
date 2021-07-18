import React from "react";
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
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  Text,
} from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";
import { useGetPools } from "hooks/farms";

const Page: React.FC = () => {
  const { fetching, pools } = useGetPools();

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
            <Button color="gray.800" variant="link">
              <Heading fontSize="xl">Active</Heading>
            </Button>

            <Button color="gray.500" variant="link">
              <Heading fontSize="xl">Inactive</Heading>
            </Button>
          </HStack>
        </HStack>

        <Container align="center" maxWidth="container.lg">
          {fetching && (
            <Flex mt={16} align="center" justify="center">
              <Spinner size="xl" />
            </Flex>
          )}

          <SimpleGrid spacing="40px" alignItems="center" columns={[1, 3]}>
            {pools.map((pool) => (
              <Box
                key={pool.pid}
                px={8}
                py={4}
                boxShadow="lg"
                rounded="3xl"
                bg="#B38E5A"
                color="white"
              >
                <HStack mb={5} spacing={6}>
                  <Heading>{pool.token}</Heading>
                </HStack>

                <HStack mb={8} spacing={4}>
                  {pool.multiplier && (
                    <Badge px={2} rounded="lg" colorScheme="gray">
                      {pool.multiplier}x
                    </Badge>
                  )}

                  {!pool.depositFees && (
                    <Badge px={2} rounded="lg" colorScheme="green">
                      No Fees
                    </Badge>
                  )}
                  {/* <Badge px={2} rounded="lg" colorScheme="red">
                    Community
                  </Badge> */}
                </HStack>

                <Stack mb={8}>
                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      APY
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.apy}%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      APR
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.apr}%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      Earn
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.earn}
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      Deposit Fee
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.depositFees}%
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      IRIS Earned
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.irisEarned}
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="900" fontSize="sm">
                      IRIS Staked
                    </Text>
                    <Text fontWeight="700" fontSize="sm">
                      {pool.irisStaked}
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
                  <Button isFullWidth bg="gray.700" _hover={{ bg: "gray.600" }}>
                    Compound
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
                        IRIS
                      </Text>
                    </Stack>

                    <Stack direction="row" justify="space-between">
                      <Text fontWeight="700" fontSize="sm">
                        Total Liquidity
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        ${pool.totalLiquidity}
                      </Text>
                    </Stack>

                    <Stack direction="row" justify="space-between">
                      <Text fontWeight="700" fontSize="sm">
                        My Liquidity
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        ${pool.userLiquidity}
                      </Text>
                    </Stack>
                  </Stack>

                  <Link href="/" textDecoration="underline" fontWeight="700" fontSize="sm">
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

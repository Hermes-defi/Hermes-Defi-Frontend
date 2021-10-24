import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { RiStackFill } from "react-icons/ri";

const Page = () => {
  return (
    <AppLayout>
      <Container maxWidth="container.md" my={8}>
        <Stack spacing={8}>
          <Stack direction="row" justify="flex-end">
            <NextLink href="/app/bank" passHref>
              <a>
                <Button colorScheme="accent">Bank</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/my" passHref>
              <a>
                <Button colorScheme="accent">My Pot</Button>
              </a>
            </NextLink>

            <NextLink href="/app/bank/lottery" passHref>
              <a>
                <Button colorScheme="secondary">Lottery</Button>
              </a>
            </NextLink>
          </Stack>

          <Stack w="100%" bg="gray.900" color="white" rounded="xl" spacing={6} py={8} px={24}>
            <Heading fontSize="5xl" borderBottom="1px" pb={4} align="center">
              My Pot
            </Heading>

            {/* rewards list */}
            <Stack spacing={3}>
              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Total
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  0.4894 IRON
                </Text>
                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  0.3123 WETH
                </Text>
                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  0.2344 WMATIC
                </Text>
              </Stack>

              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Estimated Dollar Value
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  $0.4992
                </Text>
              </Stack>

              <Stack spacing={1} align="flex-end">
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase" pb={2}>
                  Estimated Amount in APOLLO
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  123.8997 APOLLO
                </Text>
              </Stack>
            </Stack>

            <Stack>
              <Box bg="gray.600" p={4} rounded="xl">
                <Text fontSize="sm">
                  Make sure to have enough APOLLO to receive a lottery ticket since the actual amount of APOLLO you
                  compound will be less than what you see on this page due to slippage (could be up to 10%)
                </Text>
              </Box>
            </Stack>

            <Stack spacing={5}>
              <Button colorScheme="primary">Compound</Button>
              <Button colorScheme="secondary">Claim Rewards</Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

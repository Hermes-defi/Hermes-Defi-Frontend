import React from "react";
import NextLink from "next/link";
import { AppLayout } from "components/layout";
import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

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

          <Stack w="100%" bg="gray.900" color="white" rounded="xl" divider={<Divider />} spacing={6} py={8} px={24}>
            <Heading fontSize="5xl" align="center">
              Lottery
            </Heading>

            <Stack spacing={4}>
              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Price Pot
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  0.4894 IRON
                </Text>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  My Ticket
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  -
                </Text>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Probability
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  0/316 Tickets <br />
                  0.00%
                </Text>
              </Stack>

              <Stack>
                <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                  Last Winner
                </Text>

                <Text fontSize="lg" color="primary.400" fontWeight="bold">
                  #1852 0xB5....3b22
                </Text>
              </Stack>
            </Stack>

            <Stack align="center">
              <Text fontSize="sm" letterSpacing="1px" textTransform="uppercase">
                Price
              </Text>

              <Text fontSize="lg" color="primary.400" fontWeight="bold">
                0 IRON
              </Text>

              <Text fontSize="sm" letterSpacing="1px">
                Sorry better luck next time :(
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export default Page;

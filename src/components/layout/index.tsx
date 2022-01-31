import React from "react";
import { Box, Container, Image, Link, Slide, Stack, Text } from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L1_NAV_ITEMS } from "./nav-config";
import { useIrisPrice } from "hooks/prices";

export const AppLayout: React.FC = ({ children }) => {
  const { data: irisPrice } = useIrisPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={irisPrice} logo="/hermes-logo-1.png" navItems={L1_NAV_ITEMS} />

        {children}

        <Box pt={14}>
          <Slide direction="bottom" in style={{ zIndex: 10 }}>
            <Stack
              display={["none", "flex"]}
              direction="row"
              align="flex-end"
              justify="space-between"
              py={4}
              px={6}
              bg="transparent"
              shadow="md"
            >
              <Stack>
                <Text fontSize="sm" lineHeight="1.5">
                  Partnerships:
                </Text>

                <Stack spacing={5} direction="row">
                  <Image w={10} src="/roy-logo.png" alt="CryptoRoyale Logo" />
                  <Image w={9} src="/ape-logo.svg" alt="Harmonape Logo" />
                  <Image w={9} src="/lumen-logo.svg" alt="Lumen Logo" />
                </Stack>
              </Stack>

              <Stack direction="row" align="flex-end" justify="flex-end">
                <Link href="https://paladinsec.co/projects/hermes-defi/">
                  <Image
                    w={28}
                    src="https://paladinsec.co/pld/assets/audited-by-paladin-standard.svg"
                    alt="Paladin Logo"
                  />
                </Link>
              </Stack>
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

export const ApolloAppLayout: React.FC = ({ children }) => {
  const { data: irisPrice } = useIrisPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={irisPrice} logo="/apollo-logo.png" navItems={L1_NAV_ITEMS} />

        {children}

        <Box pt={14}>
          <Slide direction="bottom" in style={{ zIndex: 10 }}>
            <Stack
              display={["none", "flex"]}
              direction="row"
              align="flex-end"
              justify="space-between"
              py={4}
              px={6}
              bg="transparent"
              shadow="md"
            >
              <Stack>
                <Text lineHeight="1.5">Partnerships:</Text>

                <Stack spacing={5} direction="row">
                  <Image w={10} src="/roy-logo.png" alt="CryptoRoyale Logo" />
                  <Image w={9} src="/ape-logo.svg" alt="Harmonape Logo" />
                  <Image w={9} src="/lumen-logo.svg" alt="Lumen Logo" />
                </Stack>
              </Stack>
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

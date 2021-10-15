import React from "react";
import { Box, Container, Image, Link, Slide, Stack, Text } from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L1_NAV_ITEMS, L2_NAV_ITEMS } from "./nav-config";
import { useIrisPrice } from "hooks/prices";
import { useLayer, useLayerValue } from "components/layer-manager";

export const AppLayout: React.FC = ({ children }) => {
  const layer = useLayer();
  const { data: irisPrice } = useIrisPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation
          tokenPrice={irisPrice}
          logo={useLayerValue("/hermes-logo-1.png", "/apollo-logo.png")}
          navItems={useLayerValue(L1_NAV_ITEMS, L2_NAV_ITEMS)}
        />

        {children}

        <>
          <Box display={["none", "block"]} pos="fixed" bottom={5} pt={14} left={10}>
            <Stack>
              <Text fontSize="xs" lineHeight="1.5">
                Partnerships:
              </Text>

              <Stack spacing={5} direction="row">
                <Image w={12} objectFit="contain" src="/iron-logo.png" alt="Iron Finance Logo" />
                <Image w={12} objectFit="contain" src="/dfyn-logo.svg" alt="Dfyn Logo" />
              </Stack>
            </Stack>
          </Box>

          {layer === "l1" && (
            <Box display={["none", "block"]} pos="fixed" bottom={5} pt={14} right={10}>
              <Stack direction="row" align="flex-end" justify="flex-end">
                <Link href="https://paladinsec.co/projects/hermes-defi/">
                  <Image
                    w={24}
                    src="https://paladinsec.co/pld/assets/audited-by-paladin-standard.svg"
                    alt="Paladin Logo"
                  />
                </Link>

                <Stack as={Link} href="https://rugdoc.io/project/hermes-defi/">
                  <Image w={24} src="/rugdoc-kyc.png" alt="Rugdoc Logo" />
                  <Image
                    w={24}
                    src="https://rugdoc.io/assets/2021/05/rugdoc-review-badge-for-light-bg.svg"
                    alt="Rugdoc Logo"
                  />
                </Stack>
              </Stack>
            </Box>
          )}
        </>
      </Container>
    </Box>
  );
};

export const ApolloAppLayout: React.FC = ({ children }) => {
  const { data: irisPrice } = useIrisPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={irisPrice} logo="/apollo-logo.png" navItems={L2_NAV_ITEMS} />

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
                  <Image w={20} src="/iron-logo.png" alt="Iron Finance Logo" />
                  <Image w={20} src="/dfyn-logo.svg" alt="Dfyn Logo" />
                </Stack>
              </Stack>
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

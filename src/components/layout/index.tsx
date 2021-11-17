import React from "react";
import { Box, Container, Image, Link, Slide, Stack, Text } from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L1_NAV_ITEMS } from "./nav-config";
import { usePlutusPrice } from "hooks/prices";

export const AppLayout: React.FC = ({ children }) => {
  const { data: plutusPrice } = usePlutusPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={plutusPrice} logo="/hermes-logo-1.png" navItems={L1_NAV_ITEMS} />

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
                  <Image w={20} src="/iron-logo.png" alt="Iron Finance Logo" />
                  <Image w={20} src="/dfyn-logo.svg" alt="Dfyn Logo" />
                </Stack>
              </Stack>

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
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

import React from "react";
import { Box, Container, Image, Link, Slide, Stack, Text } from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L3_NAV_ITEMS } from "./nav-config";
import { usePlutusPrice } from "hooks/prices";

export const AppLayout: React.FC = ({ children }) => {
  const { data: plutusPrice } = usePlutusPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={plutusPrice} logo="/plutus-logo.png" navItems={L3_NAV_ITEMS} />

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

              
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

import React from "react";
import { Box, Container, Image, Stack, Text } from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L2_NAV_ITEMS } from "./nav-config";
import { useApolloPrice } from "hooks/prices";

export const AppLayout: React.FC = ({ children }) => {
  const { data: apolloPrice } = useApolloPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation tokenPrice={apolloPrice} logo="/apollo-logo.png" navItems={L2_NAV_ITEMS} />

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
        </>
      </Container>
    </Box>
  );
};

import React from "react";
import {
  Box,
  Container,
  Image,
  Link,
  Slide,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Navigation } from "./navigation";
import { L3_NAV_ITEMS } from "./nav-config";
import { usePlutusPrice } from "hooks/prices";

export const AppLayout: React.FC = ({ children }) => {
  const { data: plutusPrice } = usePlutusPrice();

  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation
          tokenPrice={plutusPrice}
          logo="/plutus-logo.png"
          navItems={L3_NAV_ITEMS}
        />

        {children}

        <Box pt={14}>
          <Slide direction="bottom" in style={{ width: "fit-content", zIndex: 10 }}>
            <Stack
              display={["none", "flex"]}
              direction="row"
              align="flex-end"
              justify="space-between"
              py={4}
              px={6}
              bg="transparent"
              shadow="md"
              w={"fit-content"}
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
            </Stack>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

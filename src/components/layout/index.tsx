import React from "react";
import { Box, Container, Image, Link, Slide, Stack } from "@chakra-ui/react";
import { Navigation } from "./navigation";

const Footer = () => {
  return (
    <Slide direction="bottom" in style={{ zIndex: 10 }}>
      <Stack
        display={["none", "flex"]}
        direction="row"
        align="flex-end"
        justify="flex-end"
        py={4}
        px={6}
        bg="transparent"
        shadow="md"
      >
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
    </Slide>
  );
};

export const AppLayout: React.FC = ({ children }) => {
  return (
    <Box>
      <Container maxW="container.xl">
        <Navigation />

        {children}

        <Box pt={14}>
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

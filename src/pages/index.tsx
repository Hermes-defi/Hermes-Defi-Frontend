import React from "react";
import Head from "next/head";
import NextLink from "next/link";

import { displayCurrency } from "libs/utils";

import {
  chakra,
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  LightMode,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useColorMode,
  Skeleton,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { RiWaterFlashFill, RiRoadMapFill, RiBookOpenFill } from "react-icons/ri";
import { GiFarmTractor, GiMegaphone } from "react-icons/gi";
import { AiOutlineAudit } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaTwitter, FaMedium, FaGithub, FaDiscord, FaYoutube } from "react-icons/fa";
import { useIrisPrice } from "hooks/prices";
import {
  useTotalInFarms,
  useTotalInBalancers,
  useTotalInPools,
  useTotalInVaults,
  useLandingPageStats,
} from "hooks/home-page";

// NAVIGATION
interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Coinmarketcap",
    isExternal: true,
    href: "https://coinmarketcap.com/currencies/hermes-defi/",
  },
  {
    label: "Coingecko",
    isExternal: true,
    href: "https://www.coingecko.com/en/coins/iris-token",
  },
];

const MobileNavItem = ({ label, children, href, isExternal }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        isExternal={isExternal}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href} isExternal={child.isExternal}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

function Navigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex color={useColorModeValue("gray.600", "white")} minH="60px" p={5} px={{ base: 0, md: 5 }} align="center">
        {/* mobile menu */}
        <Flex ml={-2} display={{ base: "flex", md: "none" }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        {/* navigation body */}
        <Flex flex={1} align="center" justify={{ base: "center", md: "space-between" }}>
          {/* logo */}
          <NextLink href="/">
            <a>
              <Stack direction="row" spacing={3}>
                <Image boxSize="40px" src="/hermes-logo-1.png" alt="Hermes Logo" />
                <Heading textAlign={{ base: "center", md: "left" }} color={useColorModeValue("gray.800", "white")}>
                  Hermes
                </Heading>
              </Stack>
            </a>
          </NextLink>

          {/* desktop navigation */}
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction={"row"} spacing={4}>
              {NAV_ITEMS.map((navItem: NavItem) => (
                <Box key={navItem.label}>
                  <Popover trigger={"hover"} placement={"bottom"}>
                    <PopoverTrigger>
                      <Flex
                        p={5}
                        as={Link}
                        href={navItem.href ?? "#"}
                        align="center"
                        color={useColorModeValue("gray.600", "gray.200")}
                        isExternal={navItem.isExternal}
                        _hover={{
                          textDecoration: "none",
                          color: useColorModeValue("gray.800", "white"),
                        }}
                        {...(navItem.decorate
                          ? {
                              color: "secondary.600",
                              fontWeight: "bold",
                            }
                          : {})}
                      >
                        <span>{navItem.label}</span>
                      </Flex>
                    </PopoverTrigger>

                    {navItem.children && (
                      <PopoverContent w="auto" border={0} boxShadow="xl" bg="white" p={4} rounded="xl">
                        <Stack>
                          {navItem.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              isExternal={child.isExternal}
                              role={"group"}
                              display={"block"}
                              p={2}
                              rounded={"md"}
                              _hover={{ bg: useColorModeValue("primary.50", "gray.900") }}
                            >
                              <Stack direction={"row"} align={"center"}>
                                <Box>
                                  <Text
                                    transition={"all .3s ease"}
                                    _groupHover={{ color: "primary.600" }}
                                    fontWeight={600}
                                  >
                                    {child.label}
                                  </Text>
                                  <Text fontSize={"sm"}>{child.subLabel}</Text>
                                </Box>
                                <Flex
                                  transition={"all .3s ease"}
                                  transform={"translateX(-10px)"}
                                  opacity={0}
                                  _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
                                  justify={"flex-end"}
                                  align={"center"}
                                  flex={1}
                                >
                                  <Icon color={"primary.500"} w={5} h={5} as={ChevronRightIcon} />
                                </Flex>
                              </Stack>
                            </Link>
                          ))}
                        </Stack>
                      </PopoverContent>
                    )}
                  </Popover>
                </Box>
              ))}
            </Stack>
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
          {NAV_ITEMS.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

// HEADER
function Header() {
  return (
    <Container maxW={"3xl"}>
      <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 12, md: 16 }}>
        <Box m="auto" boxSize="30%">
          <Image boxSize="100%" src="/hermes-logo-2.png" alt="logo" />
        </Box>

        <Stack spacing={3}>
          <Heading fontWeight={600} fontSize={{ base: "4xl", md: "6xl" }} lineHeight={"110%"}>
            Always one step further
          </Heading>

          <Text color={"gray.500"}>Safe, transparent and fast. A platform at the level of the gods.</Text>
        </Stack>

        <Stack w="70%" direction="row" spacing={5} align="center" alignSelf="center" position="relative">
          <NextLink href="/app" passHref>
            <chakra.a flex="1">
              <Button isFullWidth variant="solid" colorScheme="primary" size="lg">
                Polygon
              </Button>
            </chakra.a>
          </NextLink>

          {/* <NextLink href="https://plutus.hermesdefi.io/app" passHref>
            <chakra.a flex="1">
              <Button isFullWidth variant="solid" bg="#B05CFF" color="white" size="lg" _hover={{ bg: "#9A2EFF" }}>
                Harmony
              </Button>
            </chakra.a>
          </NextLink> */}
        </Stack>
      </Stack>
    </Container>
  );
}

// NUMBERS
const DappStats = () => {
  const { data: irisPrice } = useIrisPrice();
  // const { data: plutusPrice } = usePlutusPrice();
  const stats = useLandingPageStats();

  return (
    <Stack align="center" spacing={8}>
      {/* total tvl */}
      <Stack>
        <Box
          w="sm"
          boxShadow="2xl"
          px={[3, 10]}
          py={10}
          rounded="md"
          bgColor="secondary.200"
          bgGradient="linear(to-r, primary.300, purple.200)"
          align="center"
        >
          <Skeleton isLoaded={!!stats.data}>
            <Heading size="2xl">{displayCurrency(stats.data?.totalTvl)}</Heading>
          </Skeleton>

          <Text color="gray.700" size="sm">
            Total Value Locked
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
};

// SERVICES
function Services() {
  return (
    <Stack alignItems="center" spacing={6}>
      <Heading fontSize="5xl" align="center">
        Key Features
      </Heading>

      <Stack alignItems="stretch" spacing={6} direction={["column", "row"]}>
        <Box align="center" rounded="sm" boxShadow="base" w={["", "sm"]} py={12} px={8}>
          <Icon color="primary.600" as={GiFarmTractor} boxSize={16} />

          <Box mt={6}>
            <Heading mb={3} fontSize="2xl" color="gray.700">
              Farms
            </Heading>

            <Text>
              Facilitates trading on Decentralized Exchages and provide liquidity through a collection of funds locked
              in a smart contract.
            </Text>
          </Box>
        </Box>

        <Box align="center" rounded="sm" boxShadow="base" w={["", "sm"]} py={12} px={8}>
          <Icon color="primary.600" as={RiWaterFlashFill} boxSize={16} />

          <Box mt={6}>
            <Heading mb={3} fontSize="2xl" color="gray.700">
              Pools
            </Heading>

            <Text>
              Way of providing financial services to users through smart contracts. Existing DeFi projects aim to
              provide higher annualized earnings for specific currencies.
            </Text>
          </Box>
        </Box>

        <Box align="center" rounded="sm" boxShadow="base" w={["", "sm"]} py={12} px={8}>
          <Icon color="primary.600" as={GiMegaphone} boxSize={16} />

          <Box mt={6}>
            <Heading mb={3} fontSize="2xl" color="gray.700">
              Much more
            </Heading>

            <Text>Enter and discover our vaults, stakes, governance, NFTs & DEX section.</Text>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

// SECURITY
function Security() {
  return (
    <Stack alignItems="center" spacing={6}>
      <Heading fontSize="5xl" align="center">
        Security
      </Heading>

      <Stack justify="center" direction={["column", "row"]} spacing={7}>
        <Flex
          as={Link}
          isExternal
          href="https://hermes-defi.gitbook.io/hermes-finance/security/audits"
          maxW="250px"
          w="250px"
          bg="primary.500"
          boxShadow="base"
          rounded="xl"
          p={6}
          align="center"
          textAlign="center"
        >
          <Image size="lg" src="https://paladinsec.co/pld/assets/audited-by-paladin-standard.svg" alt="Rugdoc Logo" />
        </Flex>
      </Stack>

      <Link isExternal href="https://hermes-defi.gitbook.io/hermes-finance/security/audits">
        <Button variant="outline" colorScheme="primary" size="lg">
          More
        </Button>
      </Link>
    </Stack>
  );
}

// NEWS
function News() {
  return (
    <Stack alignItems="center" spacing={6}>
      <Heading fontSize="5xl" align="center">
        News
      </Heading>

      <Box>
        <a
          className="twitter-timeline"
          data-width="600"
          data-height="400"
          data-dnt="true"
          data-theme="light"
          href="https://twitter.com/hermesdefi?ref_src=twsrc%5Etfw"
        >
          Tweets by HermesDefi
        </a>{" "}
        <Head>
          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </Head>
      </Box>
    </Stack>
  );
}

// FOOTER
function Footer() {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} color={useColorModeValue("gray.700", "gray.200")}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid templateColumns={{ sm: "1fr 1fr", md: "2fr 2fr 1fr 1fr 1fr" }} spacing={8}>
          {/* footer info*/}
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={3}>
                <Image boxSize="40px" src="/hermes-logo-1.png" alt="Hermes Logo" />
                <Heading textAlign={{ base: "center", md: "left" }} color={useColorModeValue("gray.800", "white")}>
                  Hermes
                </Heading>
              </Stack>
            </Box>

            <Text fontSize={"sm"}>
              Hermes Finance is the Olympus of Defi. Our friendly community is building a decentralized and proactive
              platform at the forefront of modern day finance. <br />
              Join us!
            </Text>
          </Stack>

          <Stack />

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Community
            </Text>

            <Stack as={Link} isExternal href="https://twitter.com/hermesdefi" direction="row" align="center">
              <Icon color="twitter.500" as={FaTwitter} />
              <Text>Twitter</Text>
            </Stack>

            <Stack as={Link} isExternal href="https://medium.com/@HermesDefi" direction="row" align="center">
              <Icon color="gray.900" as={FaMedium} />
              <Text>Medium</Text>
            </Stack>

            <Stack as={Link} isExternal href="https://discord.gg/k6SX8pkK" direction="row" align="center">
              <Icon color="purple.500" as={FaDiscord} />
              <Text>Discord</Text>
            </Stack>

            <Stack as={Link} isExternal href="https://www.youtube.com/channel/UCnLWipB915XYPHMmMZcsnag" direction="row" align="center">
              <Icon color="red.500" as={FaYoutube} />
              <Text>Youtube</Text>
            </Stack>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Project
            </Text>

            <Stack
              as={Link}
              isExternal
              href="https://hermes-defi.gitbook.io/hermes-finance/"
              direction="row"
              align="center"
            >
              <Icon color="gray.700" as={RiBookOpenFill} />
              <Text>Docs</Text>
            </Stack>

            <Stack as={Link} isExternal href="https://github.com/Hermes-defi" direction="row" align="center">
              <Icon color="gray.700" as={FaGithub} />
              <Text>Github</Text>
            </Stack>

            <Stack
              as={Link}
              isExternal
              href="https://hermes-defi.gitbook.io/hermes-finance/security/audits"
              direction="row"
              align="center"
            >
              <Icon color="gray.700" as={AiOutlineAudit} />
              <Text>Audits</Text>
            </Stack>

            <Stack
              as={Link}
              isExternal
              href="https://hermes-defi.gitbook.io/plutus/bonus/roadmap-v.4"
              direction="row"
              align="center"
            >
              <Icon color="gray.700" as={RiRoadMapFill} />
              <Text>Roadmap</Text>
            </Stack>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Contact
            </Text>

            <Stack as={Link} isExternal href="mailto:contact@hermesdefi.io" direction="row" align="center">
              <Icon color="gray.700" as={MdEmail} />
              <Text>contact@hermesdefi.io</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const Page = () => {
  const { colorMode, setColorMode } = useColorMode();
  React.useEffect(() => {
    const currentColorMode = colorMode;
    setColorMode("light");

    return () => setColorMode(currentColorMode);
  }, []);

  return (
    <LightMode>
      <Box
        bgImage="linear-gradient(0deg, rgba(255,255,255,1) 7%, rgba(255,255,255,0.16) 28%, rgba(255,255,255,0.02) 39%), url('./bg-image-1.jpg')"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Container maxWidth="container.xl">
          <Navigation />
          <Header />
        </Container>
      </Box>

      <Container my={10} maxWidth="container.xl">
        <Stack alignItems="stretch" spacing={24}>
          <DappStats />
          <Services />
          <Security />
          <News />
        </Stack>
      </Container>

      <Footer />
    </LightMode>
  );
};

export default Page;

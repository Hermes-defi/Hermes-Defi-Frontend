import React from "react";
import Head from "next/head";
import NextLink from "next/link";

import { farmIds, poolIds } from "config/pools";
import { useERC20, useMasterChef } from "hooks/contracts";
import { getPoolPublicData, getFarmStats } from "web3-functions";
import { useQuery } from "react-query";
import { displayCurrency } from "libs/utils";

import {
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { RiWaterFlashFill, RiRoadMapFill, RiBookOpenFill } from "react-icons/ri";
import { GiFarmTractor, GiMegaphone } from "react-icons/gi";
import { AiOutlineAudit } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaTwitter, FaMedium, FaTelegram, FaGithub } from "react-icons/fa";

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
    label: "Pre Sale",
    href: "/app/pre-sale",
    decorate: true,
  },
  {
    label: "Info",
    isExternal: true,
    href: "https://vfat.tools/polygon/hermes/",
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
              <Link key={child.label} py={2} href={child.href}>
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
      <Flex
        color={useColorModeValue("gray.600", "white")}
        minH="60px"
        p={5}
        px={{ base: 0, md: 5 }}
        align="center"
      >
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
                <Heading
                  textAlign={{ base: "center", md: "left" }}
                  color={useColorModeValue("gray.800", "white")}
                >
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
                  <Popover trigger={"hover"} placement={"bottom-start"}>
                    <PopoverTrigger>
                      <Flex
                        p={2}
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
                        {navItem.isExternal && (
                          <ExternalLinkIcon mt="-1px" mx="4px" boxSize="14px" />
                        )}
                      </Flex>
                    </PopoverTrigger>

                    {navItem.children && (
                      <PopoverContent
                        border={0}
                        boxShadow={"xl"}
                        bg={useColorModeValue("white", "gray.800")}
                        p={4}
                        rounded={"xl"}
                        minW={"sm"}
                      >
                        <Stack>
                          {navItem.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
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

        <Stack ml={4} flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={6}>
          <NextLink href="/app" passHref>
            <a>
              <Button
                display={{ base: "inline-flex" }}
                size={useBreakpointValue({ base: "sm", md: "md" })}
                variant="primaryOutline"
              >
                Enter App
              </Button>
            </a>
          </NextLink>
        </Stack>
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

          <Text color={"gray.500"}>
            Safe, transparent and fast. A plataform at the level of the gods.
          </Text>
        </Stack>

        <Stack direction="row" spacing={5} align="center" alignSelf="center" position="relative">
          <NextLink href="/app" passHref>
            <a>
              <Button isFullWidth variant="solid" colorScheme="primary" size="lg">
                Enter App
              </Button>
            </a>
          </NextLink>

          <NextLink href="https://hermes-defi.gitbook.io/hermes-finance/bonus/litepaper" passHref>
            <a>
              <Button isFullWidth variant="outline" colorScheme="secondary" size="lg">
                Lite Paper
              </Button>
            </a>
          </NextLink>
        </Stack>
      </Stack>
    </Container>
  );
}

// NUMBERS
const DappStats = () => {
  const getLpContract = useERC20();
  const masterChef = useMasterChef();

  const hermesStats = useQuery("hermesStats", async () => {
    const farmLps = await Promise.all(
      farmIds.map(async (pid) => {
        const { lpAddress } = await getPoolPublicData(pid, masterChef);
        return getLpContract(lpAddress);
      })
    );

    const poolLps = await Promise.all(
      poolIds.map(async (pid) => {
        const { lpAddress } = await getPoolPublicData(pid, masterChef);
        return getLpContract(lpAddress);
      })
    );

    const resp = await getFarmStats(poolLps, farmLps);

    return resp;
  });

  return (
    <SimpleGrid columns={[2, 4]} spacing={[8, 14]}>
      <Box boxShadow="2xl" px={[3, 16]} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">$7.27</Heading>
        <Text color="gray.700" size="sm">
          $IRIS Price
        </Text>
      </Box>

      <Box boxShadow="2xl" px={[3, 16]} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">
          ${displayCurrency(hermesStats.data?.totalValueInFarms || 0, true, true)}
        </Heading>
        <Text color="gray.700" size="sm">
          Total in Farms
        </Text>
      </Box>

      <Box boxShadow="2xl" px={[3, 16]} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">
          ${displayCurrency(hermesStats.data?.totalValueInPools || 0, true, true)}
        </Heading>
        <Text color="gray.700" size="sm">
          Total in Pools
        </Text>
      </Box>

      <Box boxShadow="2xl" px={[3, 16]} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">${displayCurrency(hermesStats.data?.tvl || 0, true, true)}</Heading>
        <Text color="gray.700" size="sm">
          Total Value Locked
        </Text>
      </Box>
    </SimpleGrid>
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
              Facilitates trading on Decentralized Exchages and provide liquidity through a
              collection of funds locked in a smart contract.
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
              Way of providing financial services to users through smart contracts. Existing DeFi
              projects aim to provide higher annualized earnings for specific currencies.
            </Text>
          </Box>
        </Box>

        <Box align="center" rounded="sm" boxShadow="base" w={["", "sm"]} py={12} px={8}>
          <Icon color="primary.600" as={GiMegaphone} boxSize={16} />

          <Box mt={6}>
            <Heading mb={3} fontSize="2xl" color="gray.700">
              Coming soon
            </Heading>

            <Text>Check the roadmap in docs to see what´s going to come.</Text>
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
          color="white"
          boxShadow="base"
          rounded="xl"
          p={6}
          align="center"
          textAlign="center"
          textDecoration="none!important"
        >
          <Image src="./techrate.png" boxSize="50px" mr={5} />
          <Heading fontWeight="900" fontSize={"2xl"} fontFamily={"body"}>
            TechRate
          </Heading>
        </Flex>

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
          <Image size="lg" src="./rugdoc.svg" alt="Rugdoc Logo" />
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
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid templateColumns={{ sm: "1fr 1fr", md: "2fr 2fr 1fr 1fr 1fr" }} spacing={8}>
          {/* footer info*/}
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={3}>
                <Image boxSize="40px" src="/hermes-logo-1.png" alt="Hermes Logo" />
                <Heading
                  textAlign={{ base: "center", md: "left" }}
                  color={useColorModeValue("gray.800", "white")}
                >
                  Hermes
                </Heading>
              </Stack>
            </Box>

            <Text fontSize={"sm"}>
              Hermes Finance is the Olympus of Defi. Our friendly community is building a
              decentralized and proactive platform at the forefront of modern day finance. Join us!
            </Text>
          </Stack>

          <Stack />

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Community
            </Text>

            <Stack
              as={Link}
              isExternal
              href="https://twitter.com/hermesdefi"
              direction="row"
              align="center"
            >
              <Icon color="twitter.500" as={FaTwitter} />
              <Text>Twitter</Text>
            </Stack>

            <Stack
              as={Link}
              isExternal
              href="https://medium.com/@HermesDefi"
              direction="row"
              align="center"
            >
              <Icon color="gray.900" as={FaMedium} />
              <Text>Medium</Text>
            </Stack>

            <Stack
              as={Link}
              isExternal
              href="https://medium.com/@HermesDefi"
              direction="row"
              align="center"
            >
              <Icon color="telegram.500" as={FaTelegram} />
              <Text>Telegram</Text>
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

            <Stack
              as={Link}
              isExternal
              href="https://github.com/Hermes-defi"
              direction="row"
              align="center"
            >
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
              href="https://hermes-defi.gitbook.io/hermes-finance/products/roadmap"
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

            <Stack
              as={Link}
              isExternal
              href="mailto:contact@hermesdefi.io"
              direction="row"
              align="center"
            >
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
  return (
    <>
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
    </>
  );
};

export default Page;

import React from "react";
import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  Center,
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

import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { RiWaterFlashFill } from "react-icons/ri";
import { GiFarmTractor, GiMegaphone } from "react-icons/gi";

// NAVIGATION
interface NavItem {
  label: string;
  isExternal?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  // {
  //   label: "Find Work",
  //   children: [
  //     {
  //       label: "Job Board",
  //       subLabel: "Find your dream design job",
  //       href: "#",
  //     },
  //     {
  //       label: "Freelance Projects",
  //       subLabel: "An exclusive list for contract work",
  //       href: "#",
  //     },
  //   ],
  // },
  {
    label: "VFAT tools",
    isExternal: true,
    href: "https://github.com",
  },
];

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
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
          <Stack direction="row" spacing={3}>
            <Image boxSize="40px" src="/hermes-logo-1.png" alt="Hermes Logo" />
            <Heading
              textAlign={{ base: "center", md: "left" }}
              color={useColorModeValue("gray.800", "white")}
            >
              Hermes
            </Heading>
          </Stack>

          {/* desktop navigation */}
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction={"row"} spacing={4}>
              {NAV_ITEMS.map((navItem: NavItem) => (
                <Box key={navItem.label}>
                  <Popover trigger={"hover"} placement={"bottom-start"}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={navItem.href ?? "#"}
                        color={useColorModeValue("gray.600", "gray.200")}
                        isExternal={navItem.isExternal}
                        _hover={{
                          textDecoration: "none",
                          color: useColorModeValue("gray.800", "white"),
                        }}
                      >
                        {navItem.label}
                      </Link>
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
          <Button
            display={{ base: "inline-flex" }}
            size={useBreakpointValue({ base: "sm", md: "md" })}
            variant="primaryOutline"
            href="#"
          >
            Enter App
          </Button>
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
          <Button isFullWidth variant="solid" colorScheme="primary" size="lg">
            Enter App
          </Button>
          <Button isFullWidth variant="outline" colorScheme="secondary" size="lg">
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

// NUMBERS
function DappStats() {
  return (
    <Stack justify="center" direction="row" spacing={14}>
      <Box boxShadow="xl" px={16} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">$7.27</Heading>
        <Text color="gray.700" size="sm">
          $IRIS Price
        </Text>
      </Box>

      <Box boxShadow="xl" px={16} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">$2.27b</Heading>
        <Text color="gray.700" size="sm">
          Total Liquidity
        </Text>
      </Box>

      <Box boxShadow="xl" px={16} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">$90.5b</Heading>
        <Text color="gray.700" size="sm">
          Total Volume
        </Text>
      </Box>

      <Box boxShadow="xl" px={16} py={10} rounded="md" bg="secondary.200" align="center">
        <Heading size="2xl">$95.6b</Heading>
        <Text color="gray.700" size="sm">
          Total Value Locked
        </Text>
      </Box>
    </Stack>
  );
}

// SERVICES
function Services() {
  return (
    <Stack alignItems="center" spacing={6}>
      <Heading fontSize="5xl" align="center">
        Key Features
      </Heading>

      <Stack alignItems="stretch" spacing={6} direction="row">
        <Box rounded="sm" boxShadow="base" w="sm" py={12} px={8}>
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

        <Box rounded="sm" boxShadow="base" w="sm" py={12} px={8}>
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

        <Box rounded="sm" boxShadow="base" w="sm" py={12} px={8}>
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

      <Stack justify="center" direction="row" spacing={7}>
        <Flex
          maxW="250px"
          w="250px"
          bg="primary.500"
          color="white"
          boxShadow="base"
          rounded="xl"
          p={6}
          align="center"
          textAlign="center"
        >
          <Image src="./techrate.png" boxSize="50px" mr={5} />
          <Heading fontWeight="900" fontSize={"2xl"} fontFamily={"body"}>
            TechRate
          </Heading>
        </Flex>

        <Flex
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

      <Button variant="outline" colorScheme="primary" size="lg">
        More
      </Button>
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
          href="https://twitter.com/reactjs?ref_src=twsrc%5Etfw"
        >
          Tweets by reactjs
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

            <Link href={"#"}>Twitter</Link>
            <Link href={"#"}>Telegram</Link>
            <Link href={"#"}>Discord</Link>
            <Link href={"#"}>Medium</Link>
            <Link href={"#"}>Announcement</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Project
            </Text>

            <Link href={"#"}>Docs</Link>
            <Link href={"#"}>Github</Link>
            <Link href={"#"}>Audits</Link>
            <Link href={"#"}>Roadmap</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Contact
            </Text>
            <Link href={"#"}>contact@hermesdefi.io</Link>
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
        bgImage="linear-gradient(0deg, rgba(255,255,255,1) 15%, rgba(255,255,255,0.2) 58%, rgba(255,255,255,0.2) 93%), url('./bg-image-1.jpg')"
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

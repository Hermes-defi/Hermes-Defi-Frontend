import React from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

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
          <Heading
            textAlign={{ base: "center", md: "left" }}
            color={useColorModeValue("gray.800", "white")}
          >
            Hermes
          </Heading>

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
            variant="primary"
            href="#"
          >
            Use Hermes
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

const Page = () => {
  return (
    <Container maxWidth="container.xl">
      <Navigation />

      {/* header */}
      {/* <HStack>
        <Box w={10} h={10} bg="#E0D1A6" />
        <Box w={10} h={10} bg="#B38E5A" />
        <Box w={10} h={10} bg="#4D929E" />
        <Box w={10} h={10} bg="#B6DFDD" />
        <Box w={10} h={10} bg="#FFFFFF" />
      </HStack> */}
    </Container>
  );
};

export default Page;

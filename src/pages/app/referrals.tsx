import React from "react";
import { AppLayout } from "components/layout";
import { Box, Stack, Container, Text, useClipboard, Button, useToast } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import { useActiveWeb3React } from "wallet";
import { UnlockButton } from "components/unlock-wallet";
import { useReferral } from "hooks/contracts";
import { useQuery } from "react-query";
import { getReferralCount } from "web3-functions";

const Page: React.FC = () => {
  const referralContract = useReferral();
  const { account } = useActiveWeb3React();

  const toast = useToast();
  const link = `https://hermesdefi.io?ref=${account?.replace(/^0x/, "")}`;
  const { onCopy, hasCopied } = useClipboard(link);

  const referalCount = useQuery(
    "referalCount",
    () => {
      if (!account) return 0;
      return getReferralCount(referralContract, account);
    },
    {
      onError: ({ data, message }) => {
        toast({
          status: "error",
          position: "top-right",
          title: "Error fetching referral detail",
          description: data?.message || message,
          isClosable: true,
        });
      },
    }
  );

  return (
    <AppLayout>
      <Stack align="center" spacing={10} py={5}>
        <Container align="center" maxWidth="container.lg">
          <Text fontSize={["2xl", "5xl"]} fontWeight="bold">
            Hermes referral program
          </Text>

          <Box rounded="xl" overflow="hidden" boxShadow="md" mt={5}>
            <Box py={5} px={5} bg="gray.100">
              <Text fontSize={["md", "lg"]}>
                Share the referral link below to invite your friends and earn 2% of your friends
                earnings.
              </Text>
            </Box>

            <Box py={8} px={8}>
              {account ? (
                <>
                  <Text fontSize="lg" fontWeight="bold">
                    Your referral link
                  </Text>

                  <Text
                    mt={8}
                    py={2}
                    px={5}
                    rounded="lg"
                    mx="auto!important"
                    bg="gray.200"
                    w={["100%", "80%"]}
                  >
                    {link}
                  </Text>

                  <Button
                    mt={4}
                    onClick={onCopy}
                    leftIcon={<FiCopy />}
                    size="sm"
                    colorScheme="primary"
                    color="white"
                  >
                    {hasCopied ? "Copied" : "Copy link"}
                  </Button>
                </>
              ) : (
                <>
                  <Text fontSize="lg" fontWeight="bold">
                    Unlock your wallet to get your referral link
                  </Text>

                  <UnlockButton
                    mt={4}
                    isFullWidth={false}
                    size="md"
                    colorScheme="primary"
                    color="white"
                  />
                </>
              )}
            </Box>

            {account && (
              <Stack my={5}>
                <Text fontSize="lg" fontWeight="bold">
                  Total number of referrals
                </Text>

                <Text fontSize="lg">{referalCount.data}</Text>
              </Stack>
            )}
          </Box>
        </Container>
      </Stack>
    </AppLayout>
  );
};

export default Page;

import React from "react";
import { AppLayout } from "components/layout";
import { UnlockButton } from "components/wallet/unlock-wallet";
import { BuyNftModal } from "components/modals/buy-nft-modal";
import {
  Stack,
  Image,
  Heading,
  Box,
  Text,
  Button,
  Progress,
  useDisclosure,
} from "@chakra-ui/react";
import { useActiveWeb3React } from "wallet";
import { useApproveNft, useNFTInfo, usePurchaseNFT } from "state/nft";

const Page: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { account } = useActiveWeb3React();

  const approveMutation = useApproveNft();
  const purchaseMutation = usePurchaseNFT();

  const queryResp = useNFTInfo();
  const isLoading = queryResp.status === "loading";

  return (
    <AppLayout>
      <Stack mt={10} direction={["column-reverse", "row"]} justify="center" spacing={8}>
        {/* text section */}
        <Stack py={10} align="center" justify="center" flex="1" direction="column" spacing={8}>
          <Heading fontSize="5xl">Hermes Heroes!</Heading>

          <Text align="center">
            Hermes Heroes are descending upon the Polygon Network! The official HermesDefi
            collection of 3125 randomly generated NFTs is here! In order to celebrate our
            introduction in the NFTs sector (we'll have news here), we've decided to create our own
            collection. Get some PLUTUS, collect them and trade your Heroes across the heavens!
          </Text>

          {queryResp.data && (
            <Box w={["90%", "70%"]}>
              <Progress
                w="100%"
                size="lg"
                value={queryResp.data.percentageAvailable}
                rounded="lg"
                colorScheme="accent"
              />
              <Text align="center" mt={2} fontSize="sm" fontWeight="bold">
                {queryResp.data.totalMinted}/{queryResp.data.totalSupply} Minted
              </Text>
            </Box>
          )}

          {!account && (
            <UnlockButton
              isFullWidth={false}
              w={["90%", "70%"]}
              mt={20}
              py={8}
              rounded="xl"
              size="lg"
              colorScheme="primary"
            />
          )}

          {account && !queryResp.data?.hasUserApproved && (
            <Button
              disabled={isLoading}
              onClick={() => approveMutation.mutate()}
              isLoading={approveMutation.isLoading}
              w={["90%", "70%"]}
              mt={20}
              py={8}
              rounded="xl"
              size="lg"
              colorScheme="primary"
            >
              Approve Contract
            </Button>
          )}

          {account && queryResp.data?.hasUserApproved && (
            <>
              <Button
                disabled={isLoading}
                onClick={onOpen}
                w={["90%", "70%"]}
                mt={20}
                py={8}
                rounded="xl"
                size="lg"
                colorScheme="primary"
              >
                Buy a Hermes Hero for 150 $PLUTUS
              </Button>
              <BuyNftModal
                isOpen={isOpen}
                isLoading={purchaseMutation.isLoading}
                onPurchase={(amount) => purchaseMutation.mutateAsync(amount)}
                onClose={onClose}
                max={queryResp.data.totalAvailable}
              />
            </>
          )}
        </Stack>

        {/* image secion */}
        <Box flex="1" align="center">
          <Image shadow="lg" w="80%" src="/hermes-heroes.png" alt="Hermes Heroes" />
        </Box>
      </Stack>
    </AppLayout>
  );
};

export default Page;

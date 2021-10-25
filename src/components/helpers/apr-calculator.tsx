import React from "react";

import { Icon, useDisclosure } from "@chakra-ui/react";
import { useApolloPrice } from "hooks/prices";

import { APRModal } from "components/modals/roi-modal";

import { AiOutlineCalculator } from "react-icons/ai";

type IProps = {
  tokenSymbol: string;
  tokenLink: string;
  apr: {
    yearlyAPR: number;
    weeklyAPR: number;
    dailyAPR: number;
  };
};

export function IrisAPRCalculator({ apr, tokenLink, tokenSymbol }: IProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: apolloPrice } = useApolloPrice();

  return (
    <>
      <Icon onClick={onOpen} mr={1} as={AiOutlineCalculator} />
      <APRModal
        isOpen={isOpen}
        onClose={onClose}
        aprs={apr}
        stakeToken={{
          symbol: tokenSymbol,
          link: tokenLink,
        }}
        rewardToken={{
          symbol: "APOLLO",
          price: apolloPrice,
        }}
      />
    </>
  );
}

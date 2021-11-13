import React from "react";

import { Icon, useDisclosure } from "@chakra-ui/react";
import { usePlutusPrice } from "hooks/prices";

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

export function PlutusAPRCalculator({ apr, tokenLink, tokenSymbol }: IProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: plutusPrice } = usePlutusPrice();

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
          symbol: "PLUTUS",
          price: plutusPrice,
        }}
      />
    </>
  );
}

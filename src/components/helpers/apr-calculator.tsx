import React from "react";

import { Icon, useDisclosure } from "@chakra-ui/react";
import { useIrisPrice } from "hooks/prices";

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
  const { data: irisPrice } = useIrisPrice();

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
          symbol: "IRIS",
          price: irisPrice,
        }}
      />
    </>
  );
}

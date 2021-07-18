import React from "react";
import { ConnectModal } from "./connect-modal";
import { AccountModal } from "./account-modal";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  account?: string;
};

export const WalletModal: React.FC<Props> = (props) => {
  const Component = props.account ? AccountModal : ConnectModal;

  return <Component isOpen={props.isOpen} onClose={props.onClose} />;
};

import { Button, useDisclosure } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import React from "react";

export const CollapsableText = ({ children, maxLength = 220, forceCollapse = false }) => {
  if (forceCollapse) {
    return children.substring(0, maxLength - 3);
  } else {
    return children.substring(0, maxLength * 2 - 3);
  }
};

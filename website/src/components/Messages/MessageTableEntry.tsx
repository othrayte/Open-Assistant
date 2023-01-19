import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  LinkBox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tooltip,
  useBoolean,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { boolean } from "boolean";
import Link from "next/link";
import { useState } from "react";
import { MdThumbUpAlt, MdThumbUpOffAlt } from "react-icons/md";
import { TbMessageReport, TbReportAnalytics } from "react-icons/tb";
import { FlaggableElement } from "src/components/FlaggableElement";
import { Message } from "src/types/Conversation";
import { LabelSliderGroup } from "../Survey/LabelSliderGroup";

interface MessageTableEntryProps {
  item: Message;
  enabled?: boolean;
  highlight?: boolean;
}

export function MessageTableEntry(props: MessageTableEntryProps) {
  const { item } = props;
  const backgroundColor = useColorModeValue("gray.100", "gray.700");
  const backgroundColor2 = useColorModeValue("#DFE8F1", "#42536B");

  const avatarColor = useColorModeValue("white", "black");
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  return (
    <FlaggableElement message={item}>
      <HStack w={["full", "full", "full", "fit-content"]} gap={0} alignItems="start">
        <Avatar
          size="sm"
          variant="rounded"
          marginTop={[2, 3]}
          borderWidth="1px"
          borderColor={borderColor}
          bg={avatarColor}
          name={`${boolean(item.is_assistant) ? "Assistant" : "User"}`}
          src={`${boolean(item.is_assistant) ? "/images/logos/logo.png" : "/images/temp-avatars/av1.jpg"}`}
        />
        {props.enabled ? (
          <Link href={`/messages/${item.id}`}>
            <LinkBox
              width={["full", "full", "full", "fit-content"]}
              maxWidth={["full", "full", "full", "2xl"]}
              bg={item.is_assistant ? backgroundColor : backgroundColor2}
              p={[3, 4]}
              borderRadius="md"
              style={{ position: "relative" }}
            >
              {item.text}
              <Box
                style={{
                  float: "right",
                }}
                marginLeft="1em"
                onClick={(e) => e.preventDefault()}
              >
                <UpVoteButton />
                <LabelMessageButton />
                <ReportButton />
              </Box>
            </LinkBox>
          </Link>
        ) : (
          <Box
            width={["full", "full", "full", "fit-content"]}
            maxWidth={["full", "full", "full", "2xl"]}
            bg={item.is_assistant ? backgroundColor : backgroundColor2}
            p={[3, 4]}
            borderRadius="md"
            outline={props.highlight ? "2px solid var(--chakra-colors-blue-500)" : null}
            style={{ position: "relative" }}
          >
            {item.text}
            <Box
              style={{
                float: "right",
              }}
              marginLeft="1em"
            >
              <UpVoteButton />
              <LabelMessageButton />
              <ReportButton />
            </Box>
          </Box>
        )}
      </HStack>
    </FlaggableElement>
  );
}
const UpVoteButton = () => {
  const [voted, vote] = useBoolean(false);
  return (
    <>
      <Tooltip label="Give Kudos" bg="green.500">
        <IconButton onClick={() => vote.toggle()} variant="ghost" size="xs" aria-label="vote-up">
          {voted ? <MdThumbUpAlt /> : <MdThumbUpOffAlt />}
        </IconButton>
      </Tooltip>
    </>
  );
};

const ReportButton = () => {
  const { isOpen, onOpen: showModal, onClose: closeModal } = useDisclosure();
  const [value, setValue] = useState("");
  const [reported, setReported] = useState(false);

  const onSubmit = () => {
    // TODO: Send report
    setValue("");
    setReported(true);
    closeModal();
  };

  return (
    <>
      <Tooltip label="Report" bg="red.500">
        <IconButton isDisabled={reported} onClick={showModal} variant="ghost" size="xs" aria-label="report">
          <TbMessageReport />
        </IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              resize="none"
              placeholder="Why should this message be reviewed?"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const LabelMessageButton = () => {
  const { isOpen, onOpen: showModal, onClose: closeModal } = useDisclosure();
  const [value, setValue] = useState<number[]>(null);
  const [reported, setReported] = useState(false);

  const onSubmit = () => {
    // TODO: Send labels
    setValue(null);
    setReported(true);
    closeModal();
  };

  return (
    <>
      <Tooltip label="Label">
        <IconButton isDisabled={reported} onClick={showModal} variant="ghost" size="xs" aria-label="report">
          <TbReportAnalytics />
        </IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Label</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LabelSliderGroup
              simple
              labelIDs={[
                "fails_task",
                "not_appropriate",
                "violence",
                "excessive_harm",
                "sexual_content",
                "toxicity",
                "moral_judgement",
                "political_content",
                "humor",
                "hate_speech",
                "threat",
                "misleading",
                "helpful",
                "creative",
              ]}
              onChange={setValue}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

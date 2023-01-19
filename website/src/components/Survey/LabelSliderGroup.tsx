import {
  Text,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorMode,
  GridItem,
  RadioGroup,
  Radio,
  Button,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useId, useState } from "react";
import { colors } from "src/styles/Theme/colors";

// TODO: consolidate with FlaggableElement
interface LabelSliderGroupProps {
  labelIDs: Array<string>;
  onChange: (sliderValues: number[]) => unknown;
  isEditable?: boolean;
}

interface LabelInfo {
  zeroText: string;
  oneText: string;
  description: string;
  explanation?: string[];
}

const label_messages: {
  [label: string]: LabelInfo;
} = {
  /*spam: {
    zeroText: "Not Spam",
    oneText: "Spam",
    description: "Seems to be intentionally low-quality or irrelevant",
    explanation: [
      'We consider the following unwanted content as spam: trolling, intentional undermining of our purpose, illegal material, material that violates our code of conduct, and other things that are inappropriate for our dataset. We collect these under the common heading of "spam".',
      "This is not an assessment of whether this message is the best possible answer. Especially for prompts or user-replies, we very much want to retain all kinds of responses in the dataset, so that the assistant can learn to reply appropriately.",
      "Please mark this text as spam only if it is clearly unsuited to be part of our dataset, as outlined above, and try not to make any subjective value-judgments beyond that.",
    ],
  },*/
  fails_task: {
    zeroText: "Follows Instructions",
    oneText: "Fails Task",
    description: "Fails to follow the correct instruction / task",
  },
  not_appropriate: {
    zeroText: "Appropriate",
    oneText: "Inappropriate",
    description: "Inappropriate for customer assistant",
  },
  violence: {
    zeroText: "Harmless",
    oneText: "Encourages Violence",
    description: "Encourages or fails to discourage violence/abuse/terrorism/self-harm",
  },
  excessive_harm: {
    zeroText: "Safe",
    oneText: "Causes Harm",
    description: "Content likely to cause excessive harm not justifiable in the context",
    explanation: [
      "Harm refers to physical or mental damage or injury to someone or something. Excessive refers to a reasonable threshold of harm in the context, for instance damaging skin is not excessive in the context of surgery.",
    ],
  },
  sexual_content: { zeroText: "Non Sexual", oneText: "Sexual Content", description: "Contains sexual content" },
  toxicity: {
    zeroText: "Non Toxic",
    oneText: "Rude / Toxic",
    description: "Contains rude, abusive, profane or insulting content",
  },
  moral_judgement: {
    zeroText: "Omits Judgement",
    oneText: "Judges Morality",
    description: "Expresses moral judgement",
  },
  political_content: { zeroText: "Apolitical", oneText: "Political", description: "Expresses political views" },
  humor: {
    zeroText: "Serious",
    oneText: "Humour / Sarcasm",
    description: "Contains humorous content including sarcasm",
  },
  hate_speech: {
    zeroText: "Safe",
    oneText: "Hateful",
    description: "Content is abusive or threatening and expresses prejudice against a protected characteristic",
    explanation: [
      "Prejudice refers to preconceived views not based on reason. Protected characteristics include gender, ethnicity, religion, sexual orientation, and similar characteristics.",
    ],
  },
  threat: {
    zeroText: "Safe",
    oneText: "Contains Threat",
    description: "Contains a threat against a person or persons",
  },
  misleading: {
    zeroText: "Accurate",
    oneText: "Misleading",
    description: "Contains text which is incorrect or misleading",
  },
  helpful: { zeroText: "Unhelful", oneText: "Helpful", description: "Completes the task to a high standard" },
  creative: { zeroText: "Boring", oneText: "Creative", description: "Expresses creativity in responding to the task" },
};

export const LabelSliderGroup = ({ labelIDs, onChange, isEditable }: LabelSliderGroupProps) => {
  const [sliderValues, setSliderValues] = useState<number[]>(Array.from({ length: labelIDs.length }).map(() => null));

  return (
    <Grid
      templateColumns={{
        base: "1fr 2em 2em 2em 1fr",
        md: "minmax(max-content, 2fr) minmax(2em, 1fr) minmax(2em, 1fr) minmax(2em, 1fr) minmax(max-content, 2fr)",
      }}
      rowGap="0.2em"
      columnGap={2}
      maxWidth="45em"
    >
      {labelIDs.map((labelId, idx) =>
        labelId in label_messages ? (
          <CheckboxSliderItem
            key={idx}
            labelId={labelId}
            sliderValue={sliderValues[idx]}
            sliderHandler={(sliderValue) => {
              const newState = sliderValues.slice();
              newState[idx] = sliderValue;
              onChange(newState);
              setSliderValues(newState);
            }}
            isEditable={isEditable}
          />
        ) : null
      )}
    </Grid>
  );
};

const LabelButton = ({
  text,
  setValue,
  value,
  currentValue,
}: {
  text: string;
  setValue: (number) => void;
  value: number;
  currentValue: number;
}) => {
  return (
    <Button
      onClick={() => setValue(currentValue === value ? null : value)}
      colorScheme={currentValue === value ? "blue" : "gray"}
      fontSize={{ base: "xs", md: "md" }}
      style={{
        whiteSpace: "normal",
        overflow: "hidden",
        wordWrap: "break-word",
      }}
    >
      {text}
    </Button>
  );
};
const IntermediateButton = ({
  setValue,
  value,
  currentValue,
}: {
  setValue: (number) => void;
  value: number;
  currentValue: number;
}) => {
  return (
    <Button
      onClick={() => setValue(currentValue === value ? null : value)}
      colorScheme={currentValue === value ? "blue" : "gray"}
      textOverflow="ellipsis"
      paddingLeft="0"
      paddingRight="0"
      minWidth="2em"
    />
  );
};

function CheckboxSliderItem(props: {
  labelId: string;
  sliderValue: number;
  sliderHandler: (newVal: number) => unknown;
  isEditable: boolean;
}) {
  return (
    <>
      <LabelButton
        text={label_messages[props.labelId].zeroText}
        setValue={props.sliderHandler}
        value={0}
        currentValue={props.sliderValue}
      />
      <IntermediateButton setValue={props.sliderHandler} value={0.25} currentValue={props.sliderValue} />
      <IntermediateButton setValue={props.sliderHandler} value={0.5} currentValue={props.sliderValue} />
      <IntermediateButton setValue={props.sliderHandler} value={0.75} currentValue={props.sliderValue} />
      <LabelButton
        text={label_messages[props.labelId].oneText}
        setValue={props.sliderHandler}
        value={1}
        currentValue={props.sliderValue}
      />
      <GridItem colSpan={5} paddingBottom="1ex">
        <Text fontSize="xs">
          {label_messages[props.labelId].description}
          {label_messages[props.labelId].explanation ? (
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="explanation"
                  variant="link"
                  size="xs"
                  style={{ height: "1lh" }}
                  icon={<InformationCircleIcon className="h-4 w-4" />}
                ></IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  {label_messages[props.labelId].explanation.map((paragraph, idx) => (
                    <Text key={idx}>{paragraph}</Text>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
        </Text>
      </GridItem>
    </>
  );
}

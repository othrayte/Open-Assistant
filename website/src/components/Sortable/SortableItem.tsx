import { Button } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PropsWithChildren } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";

import { CollapsableText } from "../CollapsableText";

export const SortableItem = ({
  saveRef,
  children,
  id,
  activeId,
}: PropsWithChildren<{ saveRef: (e: HTMLElement) => void | null; id: number; activeId: number }>) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  console.log(transition);

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : "translate3d(0, 0, 0)",
    transition,
    touchAction: "none",
  };

  const { colorMode } = useColorMode();
  const themedClasses =
    colorMode === "light"
      ? "bg-slate-600 hover:bg-slate-500 text-white"
      : "bg-black hover:bg-slate-900 text-white ring-1 ring-white/30 ring-inset hover:ring-slate-200/50";

  const ghostStyle = id === 200 /*activeId*/ ? "invisible" : "";

  return (
    <li
      className={`grid grid-cols-[min-content_1fr] items-center rounded-lg shadow-md gap-x-2 p-2 ${themedClasses} ${ghostStyle}`}
      ref={(r: HTMLElement) => {
        if (id != 200) {
          setNodeRef(r);
          saveRef && saveRef(r);
        }
      }}
      style={style}
      {...attributes}
      {...listeners}
    >
      <RxDragHandleDots2 />
      <div style={{ maxHeight: activeId ? 100 : 5000, overflow: "hidden", transition: "max-height 200ms ease" }}>
        {children}
      </div>
    </li>
  );
};

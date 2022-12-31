import { RxDragHandleDots2 } from "react-icons/rx";
import { Button } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableItemProps {
  id: number;
  children: React.ReactNode;
}

export const SortableItem = ({ id, children }: SortableItemProps) => {
  const sortId = id + 1; // sort ID is 1 based indexing because useSortable can't accept 0
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sortId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className="grid grid-cols-[min-content_1fr] items-center rounded-lg shadow-md gap-x-2 p-2"
      ref={setNodeRef}
      style={style}
    >
      <Button justifyContent="center" variant="ghost" {...attributes} {...listeners}>
        <RxDragHandleDots2 />
      </Button>
      {children}
    </li>
  );
};

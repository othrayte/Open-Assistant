import { Collapse, Flex } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core/dist/types/events";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState, useRef } from "react";

import { CollapsableText } from "../CollapsableText";
import { SortableItem } from "./SortableItem";

export interface SortableProps {
  items: ReactNode[];
  onChange: (newSortedIndices: number[]) => void;
  className?: string;
}

interface SortableItems {
  id: number;
  originalIndex: number;
  item: ReactNode;
  collapsed: boolean;
}

export const Sortable = (props: SortableProps) => {
  const [itemsWithIds, setItemsWithIds] = useState<SortableItems[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    setItemsWithIds(
      props.items.map((item, idx) => ({
        item:
          item +
          `
        Nullam eget porta diam, vel aliquet lectus. Morbi fermentum diam enim, eu tincidunt tortor aliquet sed. Praesent rutrum est mi, et vehicula nisi vestibulum sit amet. Nulla convallis interdum urna. Curabitur elementum sapien in lorem ultricies euismod. Fusce gravida lorem ac ligula convallis, ut eleifend ligula placerat. Vivamus dolor sem, rhoncus ornare suscipit vel, ornare a libero. Mauris eu lectus semper, auctor libero eget, sollicitudin ipsum. Vivamus vehicula enim eget justo pulvinar, eget efficitur dui interdum. Duis facilisis vitae mauris non iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus.

        Maecenas iaculis sem lectus, et placerat quam aliquet et. Donec ut dui scelerisque, feugiat metus sed, imperdiet nibh. Nunc eu arcu dictum, fringilla ante sed, volutpat enim. Duis quis ante et lorem consectetur fermentum. Nunc id dolor in arcu condimentum dignissim. Aliquam cursus iaculis mattis. Duis a est ut enim varius consectetur. Vestibulum a arcu nunc. Nam ultrices risus tortor, non efficitur ligula sodales id. Etiam non efficitur odio. Sed eu fermentum est. Nam malesuada eu nibh id volutpat.

        Vivamus id mauris nec metus pellentesque varius eu volutpat nunc. Nullam neque mauris, iaculis eu magna volutpat, suscipit accumsan erat. Aenean eget urna rhoncus, commodo ligula vitae, ullamcorper justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse et nulla neque. Sed scelerisque lacus dui, non tincidunt diam sagittis vel. Quisque finibus vehicula pellentesque. Maecenas et metus eget turpis interdum sagittis. Nunc blandit augue ultricies sem mattis, a luctus velit eleifend. Praesent in risus vitae quam finibus hendrerit vitae sit amet eros.
        `,
        id: idx + 1, // +1 because dndtoolkit has problem with "falsy" ids
        originalIndex: idx,
        collapsed: false,
      }))
    );
  }, [props.items]);

  const ref = useRef(null);
  const itemEls = useRef({});

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const extraClasses = props.className || "";
  const activeItem = itemsWithIds.find((item) => item.id == activeId);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={itemsWithIds} strategy={verticalListSortingStrategy}>
        <Flex direction="column" gap={2} className={extraClasses}>
          {itemsWithIds.map(({ id, item, collapsed }) => (
            <SortableItem
              saveRef={(element: HTMLElement) => {
                itemEls.current[id] = element;
              }}
              key={id}
              id={id}
              activeId={activeId}
              collapsed={collapsed}
              onClick={() => {
                const newState = itemsWithIds.slice();
                const item = newState.find((item) => item.id == id);
                item.collapsed = !item.collapsed;
                setItemsWithIds(newState);
              }}
            >
              {item}
            </SortableItem>
          ))}
        </Flex>
        <DragOverlay>
          {activeId ? (
            <SortableItem saveRef={null} id={0} activeId={activeId} collapsed={activeItem.collapsed}>
              {activeItem.item}
            </SortableItem>
          ) : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const newState = itemsWithIds.slice();
    newState.forEach((item) => (item.collapsed = true));
    setItemsWithIds(newState);
    setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) {
      return;
    }
    setItemsWithIds((items) => {
      const oldIndex = items.findIndex((x) => x.id === active.id);
      const newIndex = items.findIndex((x) => x.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      props.onChange(newArray.map((item) => item.originalIndex));
      return newArray;
    });
  }
};

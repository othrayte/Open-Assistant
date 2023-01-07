import { Flex } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
}

const defaultScale = {
  scaleX: 1,
  scaleY: 1,
};

const customVerticalListSortingStrategy =
  (preRect: DOMRect | null): SortingStrategy =>
  ({ activeIndex, activeNodeRect: fallbackActiveRect, index, rects, overIndex }) => {
    const activeNodeRect = rects[activeIndex] ?? fallbackActiveRect;
    console.log(index);
    if (!activeNodeRect) {
      return null;
    }

    if (preRect) {
      return {
        x: 0,
        y: preRect.top - rects[activeIndex].top,
        ...defaultScale,
      };
    }

    if (index === activeIndex) {
      const overIndexRect = rects[overIndex];

      if (!overIndexRect) {
        return null;
      }

      return {
        x: 0,
        y:
          activeIndex < overIndex
            ? overIndexRect.top + overIndexRect.height - (activeNodeRect.top + activeNodeRect.height)
            : overIndexRect.top - activeNodeRect.top,
        ...defaultScale,
      };
    }

    // TODO: Handle single item case
    const itemGap = rects[1].top - rects[0].bottom;

    if (index > activeIndex && index <= overIndex) {
      return {
        x: 0,
        y: -activeNodeRect.height - itemGap,
        ...defaultScale,
      };
    }

    if (index < activeIndex && index >= overIndex) {
      return {
        x: 0,
        y: activeNodeRect.height + itemGap,
        ...defaultScale,
      };
    }

    return {
      x: 0,
      y: 0,
      ...defaultScale,
    };
  };

export const Sortable = (props: SortableProps) => {
  const [itemsWithIds, setItemsWithIds] = useState<SortableItems[]>([]);
  const [activeDrag, setActiveDrag] = useState(null);

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
      }))
    );
  }, [props.items]);

  const ref = useRef(null);
  const itemEls = useRef({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const extraClasses = props.className || "";

  const wrapperStyle = activeDrag
    ? {
        /*height: activeDrag.dragAreaHeight,*/
        /*transform: `translate3d(0, ${0}px, 0)`*/
      }
    : {};

  let y = null;

  return (
    <div
      ref={ref}
      style={wrapperStyle}
      onMouseMove={(ev) => {
        y = ev.clientY;
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={itemsWithIds} strategy={customVerticalListSortingStrategy(activeDrag?.activeRect)}>
          <Flex direction="column" gap={2} className={extraClasses}>
            {itemsWithIds.map(({ id, item }) => (
              <SortableItem
                saveRef={(element: HTMLElement) => {
                  itemEls.current[id] = element;
                }}
                key={id}
                id={id}
                activeId={activeDrag?.activeId}
              >
                {item}
              </SortableItem>
            ))}
          </Flex>
          <DragOverlay>
            {activeDrag ? (
              <SortableItem saveRef={null} id={200} activeId={0}>
                {itemsWithIds.find((item) => item.id == activeDrag.activeId).item}
              </SortableItem>
            ) : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    console.log(y);
    console.log(ref.current.getBoundingClientRect());
    console.log(active.id);
    console.log(itemEls.current[active.id]);
    setActiveDrag({
      activeId: active.id,
      dragAreaHeight: ref.current.clientHeight,
      activeRect: itemEls.current[active.id].getBoundingClientRect(),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDrag(null);
    if (active.id === over.id) {
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

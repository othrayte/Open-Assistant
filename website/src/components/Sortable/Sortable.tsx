import { ReactNode, useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export interface SortableProps {
  items: ReactNode[];
  onChange: (newSortedIndices: number[]) => void;
}

export const Sortable = ({ items, onChange }: SortableProps) => {
  const [sortOrder, setSortOrder] = useState<number[]>([]);

  const update = (newRanking: number[]) => {
    setSortOrder(newRanking);
    onChange(newRanking);
  };

  useEffect(() => {
    const indices = Array.from({ length: items.length }).map((_, i) => i);
    setSortOrder(indices);
    onChange(indices);
  }, [items, onChange]);

  return (
    <ul className="flex flex-col gap-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (active.id !== over.id) {
            const newRanking = sortOrder.slice()
            const activeIndex = active.id as number - 1
            const newIndex = over.id as number - 1;
            [newRanking[activeIndex], newRanking[newIndex]] = [newRanking[newIndex], newRanking[activeIndex]]
            update(newRanking)
          }
        }}
      >
        <SortableContext items={sortOrder.map((index) => index + 1)} strategy={verticalListSortingStrategy}>
          {sortOrder.map((index) => (
            <SortableItem key={index} id={index}>
              {items[index]}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </ul>
  );
};

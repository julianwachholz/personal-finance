import React, { HTMLAttributes, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import "./SortableTable.scss";

const ROW_TYPE = "row";

interface DragItem {
  index: number;
  pk: number;
  type: string;
}

interface DndRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, "onDrop"> {
  index: number;
  pk: number;
  onDrop: (item: DragItem, monitor: DropTargetMonitor) => void;
}

export const DndRow = ({ index, pk, onDrop, ...props }: DndRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ROW_TYPE,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const [{ isDragging, dragItem }, drag] = useDrag({
    item: { type: ROW_TYPE, index, pk },
    // isDragging(monitor: DragSourceMonitor) {
    //   const item = monitor.getItem();
    //   return index === item.index;
    // },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      dragItem: monitor.getItem()
    })
  });

  let className = "dnd ";
  if (isOver) {
    if (index > dragItem.index) {
      className += "dnd-over-down";
    }
    if (index < dragItem.index) {
      className += "dnd-over-up";
    }
  }

  drag(drop(ref));
  return (
    <tr
      ref={ref}
      {...props}
      className={className}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    />
  );
};

import { Input, Label, Text } from "@medusajs/ui";
import { PlusMini, XMarkMini, DotsSix } from "@medusajs/icons";
import { useCallback } from "react";
import update from "immutability-helper";
import React from "react";
import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export interface CardProps {
  id: any;
  value: { value: string };
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onChange: (key: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteRow: (key: number) => () => void;
  errors: { message: string }[];
}

interface DragItem {
  index: number;
  id: string;
  type: {
    value: string;
  };
}

export const AttributeCard = ({
  id,
  index,
  moveCard,
  value,
  errors,
  onChange,
  deleteRow,
}: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const style = {
    cursor: "move",
  };

  return (
    <div
      className="flex flex-col gap-y-2"
      ref={ref}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
    >
      <div className="flex items-center gap-2 w-full">
        <DotsSix color="rgba(156, 163, 175, 1)" />
        <div className="w-full">
          <div className="flex gap-2 items-center" key={index}>
            <div className="w-full">
              <Input
                placeholder="Enter the value"
                onChange={onChange(index)}
                value={value.value}
              />
            </div>
            <XMarkMini
              className="cursor-pointer"
              color="rgba(3, 7, 18, 0.4)"
              onClick={deleteRow(index)}
            />
          </div>
        </div>
      </div>

      {errors?.[index] && (
        <Text className="text-ui-fg-error">Enter the value</Text>
      )}
    </div>
  );
};

export const AttributeValues = ({
  setValues,
  values,
  errors,
}: {
  values: { value: string }[];
  setValues: (values: { value: string }[]) => void;
  ref: any;
  errors: { message: string }[];
}) => {
  const addValue = () => {
    setValues([...values, { value: "" }]);
  };

  const onChange =
    (key: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValues = [...values];
      newValues[key] = { value: e.target.value };
      setValues(newValues);
    };

  const deleteRow = (key: number) => () => {
    if (values.length === 1) {
      return;
    }

    const newValues = [...values];
    newValues.splice(key, 1);
    setValues(newValues);
  };

  if (!values) {
    return null;
  }

  const move = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // @ts-ignore
      setValues(
        update(values, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, values[dragIndex] as { value: string }],
          ],
        })
      );
    },
    [values]
  );

  const renderRow = useCallback(
    (val: { value: string }, index: number) => {
      return (
        <AttributeCard
          key={index}
          index={index}
          id={index}
          value={val}
          moveCard={move}
          deleteRow={deleteRow}
          errors={errors}
          onChange={onChange}
        />
      );
    },
    [errors, move, onChange, values, setValues, deleteRow]
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Value</Label>
      <div className="flex flex-col gap-y-4">
        {values?.map((val, key) => renderRow(val, key))}
      </div>
      <div
        className="flex items-center gap-2 mt-4 cursor-pointer"
        onClick={addValue}
      >
        <PlusMini color="rgb(59, 130, 246)" />
        <Label className="text-ui-bg-interactive cursor-pointer">Add</Label>
      </div>
    </div>
  );
};

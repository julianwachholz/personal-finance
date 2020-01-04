import { Radio } from "antd";
import { RadioGroupProps } from "antd/lib/radio";
import React from "react";
import "./ColorSelect.scss";

interface ColorSelectProps extends RadioGroupProps {
  colors?: string[];
}

const tagColors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple"
];

const ColorSelect = ({
  value,
  colors = tagColors,
  ...props
}: ColorSelectProps) => {
  return (
    <Radio.Group
      prefixCls="colorselect"
      className="radio-group-color"
      value={value}
      {...props}
    >
      {colors.map(color => (
        <Radio.Button
          key={color}
          value={color}
          className={`ant-tag-${color}${color === value ? "-inverse" : ""}`}
          prefixCls="colorselect"
          data-color={color}
        >
          {color}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default ColorSelect;

import Input, { InputProps } from "antd/lib/input";
import React from "react";
import "./ColorInput.scss";

const ColorInput = ({ value, ...props }: InputProps) => {
  return (
    <Input
      type="color"
      className="input-color"
      addonBefore={value || "#------"}
      value={value}
      {...props}
    />
  );
};

export default ColorInput;

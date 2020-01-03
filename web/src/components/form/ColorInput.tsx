import { InputProps } from "antd/lib/input";
import React from "react";
import "./ColorInput.scss";
import { SizedInput } from "./SizedInput";

const ColorInput = ({ value, ...props }: InputProps) => {
  return (
    <SizedInput
      type="color"
      className="input-color"
      addonBefore={value || "#------"}
      value={value}
      {...props}
    />
  );
};

export default ColorInput;

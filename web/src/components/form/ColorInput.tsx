import { Input } from "antd";
import { InputProps } from "antd/lib/input";
import React from "react";
import "./ColorInput.scss";

const ColorInput: React.FC<InputProps> = React.forwardRef(
  ({ value, onChange = () => {}, ...props }, ref) => {
    return (
      <Input
        type="color"
        className="input-color"
        ref={ref as any}
        value={value}
        onChange={e => {
          onChange(e);
        }}
        addonBefore={value || "#------"}
        {...props}
      />
    );
  }
);

export default ColorInput;

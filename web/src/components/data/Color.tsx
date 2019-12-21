import { Input } from "antd";
import React from "react";
import "./Color.scss";

type RGB = {
  r: number;
  g: number;
  b: number;
};

function hex2rgb(value: string): RGB {
  const match = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  if (!match) {
    throw new Error("invalid color");
  }
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

function highContrast(value: string): string {
  const rgb = hex2rgb(value);

  // W3C version:
  //   let c = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  //   c = c.map(v => {
  //     if (v <= 0.03928) {
  //       return v / 12.92;
  //     } else {
  //       return Math.pow((v + 0.055) / 1.055, 2.4);
  //     }
  //   });
  //   const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  //   const isLight = l > 0.179;

  // Simple version:
  const isLight = 0.213 * rgb.r + 0.715 * rgb.g + 0.072 * rgb.b > 255 / 2;

  if (isLight) {
    return "rgba(0,0,0,0.65)";
  } else {
    return "rgba(255,255,255,0.85)";
  }
}

interface ColorProps {
  value: string;
}

const Color = ({ value }: ColorProps) => {
  try {
    return (
      <Input
        readOnly
        value={value}
        style={{ background: value, color: highContrast(value) }}
        className="color ant-input-disabled"
      />
    );
  } catch (e) {
    return null;
  }
};

export default Color;

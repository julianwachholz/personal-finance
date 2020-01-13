import { Button } from "antd-mobile";
import { ButtonProps } from "antd-mobile/lib/button";
import React from "react";
import "./Fab.scss";

const Fab = (props: ButtonProps) => {
  return (
    <Button type="primary" className="floating-action-button" {...props} />
  );
};

export default Fab;

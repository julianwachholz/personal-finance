import React from "react";
import AppHeader, { AppHeaderProps } from "../../components/layout/AppHeader";
import "./BaseModule.scss";

const BaseModule: React.FC<AppHeaderProps> = ({ children, ...props }) => (
  <div className="module">
    <AppHeader {...props} />
    <div className="module-content">{children}</div>
  </div>
);

export default BaseModule;

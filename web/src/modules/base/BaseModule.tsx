import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import AppHeader from "../../components/layout/AppHeader";
import "./BaseModule.scss";

const BaseModule: React.FC<PageHeaderProps> = ({ children, ...props }) => (
  <div className="module">
    <AppHeader {...props} />
    <div className="module-content">{children}</div>
  </div>
);

export default BaseModule;

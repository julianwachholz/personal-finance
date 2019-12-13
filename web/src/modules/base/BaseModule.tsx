import { PageHeader } from "antd";
import { PageHeaderProps } from "antd/lib/page-header";
import React from "react";
import "./BaseModule.scss";

const BaseModule: React.FC<PageHeaderProps> = ({ children, ...props }) => (
  <div className="module">
    <PageHeader {...props} />
    {children}
  </div>
);

export default BaseModule;

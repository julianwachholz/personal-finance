import { PageHeader } from "antd";
import React from "react";
import "./BaseModule.scss";

interface ICreateProps {
  title: string;
}

const BaseModule: React.FC<ICreateProps> = props => (
  <div className="module">
    <PageHeader title={props.title} />
    {props.children}
  </div>
);

export default BaseModule;

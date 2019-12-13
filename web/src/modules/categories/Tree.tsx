import { Spin, Tree } from "antd";
import { AntTreeNodeDropEvent } from "antd/lib/tree/Tree";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ITreeCategory, useCategoryTree } from "../../dao/categories";
import BaseModule from "../base/BaseModule";

const { TreeNode: Node } = Tree;

const CategoryTree: React.FC<RouteComponentProps> = () => {
  const { data } = useCategoryTree({ page: 1 });

  const onDrop = (info: AntTreeNodeDropEvent) => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
  };

  if (!data) {
    return <Spin />;
  }

  const renderNode = (category: ITreeCategory) => {
    if (category.children && category.children.length) {
      return (
        <Node key={category.pk.toString()} title={category.label}>
          {category.children.map(renderNode)}
        </Node>
      );
    }
    return <Node key={category.pk.toString()} title={category.label} />;
  };

  return (
    <BaseModule
      title="Categories"
      extra={[
        <Link key="view" to="/settings/categories" className="ant-btn">
          List View
        </Link>
      ]}
    >
      <Tree draggable onDrop={() => {}}>
        {data.results.map(renderNode)}
      </Tree>
    </BaseModule>
  );
};

export default CategoryTree;

import { Spin, Tree } from "antd";
import { AntTreeNodeDropEvent } from "antd/lib/tree/Tree";
import React from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  ITreeCategory,
  moveCategory,
  MovePosition,
  useCategoryTree
} from "../../dao/categories";
import BaseModule from "../base/BaseModule";

const { TreeNode: Node } = Tree;

const CategoryTree: React.FC<RouteComponentProps> = () => {
  const { data } = useCategoryTree({ page: 1 });
  const [moveNode] = useMutation(moveCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });

  const onDrop = (info: AntTreeNodeDropEvent) => {
    const dropKey = parseInt(info.node.props.eventKey!, 10);
    const dragKey = parseInt(info.dragNode.props.eventKey!, 10);
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    let position: MovePosition = "first-child";
    if (dropPosition === 0) {
      position = "last-child";
    } else if (dropPosition === -1) {
      position = "left";
    } else if (dropPosition === 1) {
      position = "right";
    }
    moveNode({ pk: dragKey, target_pk: dropKey, position });
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
      <Tree draggable onDrop={onDrop}>
        {data.results.map(renderNode)}
      </Tree>
    </BaseModule>
  );
};

export default CategoryTree;

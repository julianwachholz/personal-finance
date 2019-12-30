import { Button, Spin, Tree } from "antd";
import { AntTreeNodeDropEvent } from "antd/lib/tree/Tree";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  moveCategory,
  MovePosition,
  TreeCategory,
  useCategoryTree
} from "../../dao/categories";
import BaseModule from "../base/BaseModule";

const { TreeNode: Node } = Tree;

const CategoryTree = ({ history }: RouteComponentProps) => {
  const { data, isLoading } = useCategoryTree({ page: 1 });
  const [move] = useMutation(moveCategory, {
    refetchQueries: ["items/categories", "items/categories/tree"]
  });
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

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
    move({ pk: dragKey, target_pk: dropKey, position });
  };

  if (!data || isLoading) {
    return <Spin />;
  }

  const keysWithChildren: string[] = [];

  const renderNode = (category: TreeCategory) => {
    const props = {
      key: category.pk.toString(),
      title: category.label
    };
    if (category.children?.length) {
      keysWithChildren.push(props.key);
      return <Node {...props}>{category.children.map(renderNode)}</Node>;
    }
    return <Node {...props} />;
  };

  return (
    <BaseModule
      title="Categories"
      extra={[
        <Button key="expand" onClick={() => setExpandedKeys(keysWithChildren)}>
          Expand All
        </Button>,
        <Button
          key="collapse"
          onClick={() => {
            setExpandedKeys([]);
          }}
        >
          Collapse All
        </Button>,
        <Button key="create" type="primary">
          <Link to={`/settings/categories/create`}>Create Category</Link>
        </Button>
      ]}
    >
      <Tree
        draggable
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onDrop={onDrop}
        onSelect={selectedKeys => {
          history.push(`/settings/categories/${selectedKeys[0]}`);
        }}
      >
        {data.results.map(renderNode)}
      </Tree>
    </BaseModule>
  );
};

export default CategoryTree;

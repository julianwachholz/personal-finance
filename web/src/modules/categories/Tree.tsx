import { Button, Spin, Tree } from "antd";
import { AntTreeNodeDropEvent, TreeNodeNormal } from "antd/lib/tree/Tree";
import React, { useMemo, useState } from "react";
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
  const { data, isLoading } = useCategoryTree();
  const [move] = useMutation(moveCategory, {
    refetchQueries: ["items/categories/tree"]
  });

  const defaultOpenKeys = JSON.parse(
    localStorage.getItem("categories_open") ?? "[]"
  );
  const [expandedKeys, _setExpandedKeys] = useState<string[]>(defaultOpenKeys);

  const setExpandedKeys = (keys: string[]) => {
    _setExpandedKeys(keys);
    localStorage.setItem("categories_open", JSON.stringify(keys));
  };

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

  const keysWithChildren: string[] = [];

  const renderNode = (category: TreeCategory) => {
    const node: TreeNodeNormal = {
      key: category.pk.toString(),
      title: category.label
    };
    if (category.children?.length) {
      keysWithChildren.push(node.key);
      node.children = category.children.map(renderNode);
    }
    return node;
  };

  const treeData = useMemo(() => {
    if (data) {
      return data.results.map(renderNode);
    }
  }, [data]);

  if (!data || isLoading) {
    return <Spin />;
  }

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
        treeData={treeData}
        draggable
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onDrop={onDrop}
        onSelect={selectedKeys => {
          history.push(`/settings/categories/${selectedKeys[0]}`);
        }}
      />
    </BaseModule>
  );
};

export default CategoryTree;

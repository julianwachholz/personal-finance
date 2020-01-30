import { FolderOutlined } from "@ant-design/icons";
import { Button, message, Result, Spin, Tree } from "antd";
import { AntTreeNodeDropEvent, TreeNodeNormal } from "antd/lib/tree/Tree";
import React, { useMemo, useState } from "react";
import { MobileView } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Fab from "../../components/button/Fab";
import {
  createDefaultCategories,
  moveCategory,
  MovePosition,
  TreeCategory,
  useCategoryTree
} from "../../dao/categories";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const CategoryTree = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("categories");
  const { data, isLoading } = useCategoryTree();
  const [move] = useMutation(moveCategory, {
    refetchQueries: ["items/categories/tree"]
  });
  const [createDefault] = useMutation(createDefaultCategories, {
    refetchQueries: ["items/categories/tree", "user"]
  });
  const [createDefaultLoading, setCreateDefaultLoading] = useState(false);

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

  const [treeData, keysWithChildren] = useMemo(() => {
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

    if (data) {
      return [data.results.map(renderNode), keysWithChildren];
    }
    return [undefined, []];
  }, [data]);

  useTitle(t("categories:category_plural", "Categories"));

  if (!data || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("categories:category_plural", "Categories")}
      extra={[
        <Button key="expand" onClick={() => setExpandedKeys(keysWithChildren)}>
          {t("categories:expand_all", "Expand All")}
        </Button>,
        <Button
          key="collapse"
          onClick={() => {
            setExpandedKeys([]);
          }}
        >
          {t("categories:collapse_all", "Collapse All")}
        </Button>,
        <Button key="create" type="primary">
          <Link to={`/settings/categories/create`}>
            {t("categories:create", "Create Category")}
          </Link>
        </Button>
      ]}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <MobileView>
        <Fab
          icon={<FolderOutlined />}
          onClick={() => {
            history.push(`/settings/categories/create`);
          }}
        />
      </MobileView>
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
      {!isLoading && !treeData?.length && (
        <Result
          title={t("categories:no_data", "No categories")}
          subTitle={t(
            "categories:empty",
            "It looks like you haven't created any categories yet."
          )}
          extra={
            <Button
              size="large"
              type="primary"
              loading={createDefaultLoading}
              onClick={async () => {
                setCreateDefaultLoading(true);
                try {
                  await createDefault();
                  message.success(
                    t(
                      "categories:default_created",
                      "Default categories created"
                    )
                  );
                } catch (e) {
                  message.error(
                    t(
                      "categories:default_create_error",
                      "Could't create default categories"
                    )
                  );
                }
                setCreateDefaultLoading(false);
              }}
            >
              {t("categories:default_create", "Create Default Categories")}
            </Button>
          }
        ></Result>
      )}
    </BaseModule>
  );
};

export default CategoryTree;

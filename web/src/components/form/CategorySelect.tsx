import TreeSelect, { TreeSelectProps } from "antd/lib/tree-select";
import React, { useMemo } from "react";
import { Category, TreeCategory, useCategoryTree } from "../../dao/categories";

const { TreeNode: Node } = TreeSelect;

const CategorySelect = (props: TreeSelectProps<Category>) => {
  const { data: categoryTree, isLoading } = useCategoryTree();

  const defaultExpandedKeys = JSON.parse(
    localStorage.getItem("categories_open") ?? "[]"
  );

  const treeData = useMemo(() => {
    const renderNode = (category: TreeCategory) => {
      const props = {
        key: category.pk.toString(),
        value: category.pk.toString(),
        title: category.label,
        searchIndex: category.label.toLowerCase()
      };

      if (category.children?.length) {
        return <Node {...props}>{category.children.map(renderNode)}</Node>;
      }
      return <Node {...props} />;
    };
    if (categoryTree) {
      return categoryTree.results.map(renderNode);
    }
  }, [categoryTree]);
  return (
    <TreeSelect<Category>
      showSearch
      dropdownStyle={{ maxHeight: 300 }}
      filterTreeNode={(search, node: any) =>
        node.props.searchIndex.includes(search.toLowerCase())
      }
      // TODO suffixIcon={isLoading ? <LoadingOutlined /> : undefined}
      treeDefaultExpandedKeys={defaultExpandedKeys}
      disabled={isLoading}
      {...props}
    >
      {treeData}
    </TreeSelect>
  );
};

export default CategorySelect;

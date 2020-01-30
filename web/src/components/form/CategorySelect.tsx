import TreeSelect, { TreeSelectProps } from "antd/lib/tree-select";
import React, { useMemo } from "react";
import { TreeCategory, useCategoryTree } from "../../dao/categories";
import { useSettings } from "../../utils/SettingsProvider";

const { TreeNode: Node } = TreeSelect;

const CategorySelect = ({ value, ...props }: TreeSelectProps<string>) => {
  const { tableSize } = useSettings();
  const { data: categoryTree, isLoading } = useCategoryTree();

  const defaultExpandedKeys = JSON.parse(
    localStorage.getItem("categories_open") ?? "[]"
  );

  const treeData = useMemo(() => {
    const renderNode = (category: TreeCategory) => {
      const props = {
        key: category.pk.toString(),
        value: category.pk,
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
    <TreeSelect<string>
      showSearch
      labelInValue
      dropdownStyle={{ maxHeight: 260, minWidth: 300 }}
      filterTreeNode={(search, node: any) =>
        node.props.searchIndex.includes(search.toLowerCase())
      }
      treeDefaultExpandedKeys={defaultExpandedKeys}
      disabled={isLoading || treeData?.length === 0}
      size={tableSize}
      value={value}
      {...props}
    >
      {treeData}
    </TreeSelect>
  );
};

export default CategorySelect;

import { Button, Col, Form, Input, Row, Select, TreeSelect } from "antd";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ColorInput from "../../components/form/ColorInput";
import {
  ICategory,
  ITreeCategory,
  useCategoryTree
} from "../../dao/categories";

const { TreeNode: Node } = TreeSelect;
const { Option } = Select;

interface IFormProps {
  data?: ICategory;
  onSave: (values: ICategory) => void;
}

const CategoryForm: React.FC<IFormProps> = ({ data, onSave }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState("first-child");
  const { data: categoryTree, isLoading } = useCategoryTree({ page: 1 });

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      debugger;
      return;
    }
    const newData = {
      ...values
    };
    onSave(newData);
  };

  const treeData = useMemo(() => {
    const renderNode = (category: ITreeCategory) => {
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
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ position: "first-child", ...data }}
    >
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item name="icon" label="Icon">
            <Input placeholder="📗" style={{ textAlign: "center" }} />
          </Form.Item>
        </Col>
        <Col span={22}>
          <Form.Item name="name" label="Name" required>
            <Input placeholder="Ledger" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="color" label="Color">
        <ColorInput />
      </Form.Item>
      {!data && (
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="position" label="Position" required>
              <Select onChange={value => setPosition(value as string)}>
                <Option value="first-child">Top of</Option>
                <Option value="last-child">Bottom of</Option>
                <Option value="left">Before</Option>
                <Option value="right">After</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              name="target"
              label={
                ["left", "right"].includes(position) ? "Neighbor" : "Parent"
              }
              required
            >
              <TreeSelect
                showSearch
                dropdownStyle={{ maxHeight: 300 }}
                searchPlaceholder="Search Category"
                filterTreeNode={(search, node: any) =>
                  node.props.searchIndex.includes(search.toLowerCase())
                }
                placeholder="Select where to insert the new Category"
                // TODO suffixIcon={isLoading ? <LoadingOutlined /> : undefined}
                disabled={isLoading}
              >
                {treeData}
              </TreeSelect>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item>
        <>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Category
          </Button>
          <Link
            to={
              (data && `/settings/categories/${data.pk}`) ??
              `/settings/categories`
            }
          >
            <Button>Discard</Button>
          </Link>
        </>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;

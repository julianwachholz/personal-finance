import { Button, Col, Form, Icon, Input, Row, Select, TreeSelect } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { useState } from "react";
import ColorInput from "../../components/form/ColorInput";
import {
  ICategory,
  ITreeCategory,
  useCategoryTree
} from "../../dao/categories";

const { TreeNode: Node } = TreeSelect;
const { Option } = Select;

interface IFormProps extends FormComponentProps {
  data?: ICategory;
  onSave: (values: ICategory) => void;
}

const CategoryFormComponent: React.FC<IFormProps> = ({
  data,
  form,
  onSave
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState("first-child");
  const { data: categoryTree, isLoading } = useCategoryTree({ page: 1 });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newData = {
          ...values
        };
        onSave(newData);
      } else {
        setSubmitting(false);
      }
    });
  };

  const renderNode = (category: ITreeCategory) => {
    const props = {
      key: category.pk.toString(),
      value: category.pk.toString(),
      title: category.label
    };

    if (category.children && category.children.length) {
      return <Node {...props}>{category.children.map(renderNode)}</Node>;
    }
    return <Node {...props} />;
  };

  return (
    <Form layout="horizontal" onSubmit={onSubmit}>
      <Row gutter={16}>
        <Col span={2}>
          <Form.Item label="Icon">
            {form.getFieldDecorator("icon", {
              initialValue: data && data.icon
            })(<Input placeholder="📗" style={{ textAlign: "center" }} />)}
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="Name">
            {form.getFieldDecorator("name", {
              initialValue: data && data.name,
              rules: [{ required: true }]
            })(<Input placeholder="Ledger" style={{ width: "90%" }} />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Color">
        {form.getFieldDecorator("color", {
          initialValue: data && data.color
        })(<ColorInput style={{ width: "50%" }} />)}
      </Form.Item>
      {!data && (
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Position">
              {form.getFieldDecorator("position", {
                initialValue: "first-child",
                rules: [{ required: true }]
              })(
                <Select onChange={setPosition}>
                  <Option value="first-child">Top of</Option>
                  <Option value="last-child">Bottom of</Option>
                  <Option value="left">Before</Option>
                  <Option value="right">After</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              label={
                ["left", "right"].includes(position) ? "Neighbor" : "Parent"
              }
            >
              {form.getFieldDecorator("target", {
                rules: [{ required: true }]
              })(
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 300 }}
                  searchPlaceholder="Search Category"
                  filterTreeNode={(search, node) => {
                    return node.props.title
                      .toLowerCase()
                      .includes(search.toLowerCase());
                  }}
                  style={{ width: "50%" }}
                  placeholder="Select where to insert the new Category"
                  suffixIcon={isLoading ? <Icon type="loading" /> : undefined}
                  disabled={isLoading}
                >
                  {categoryTree && categoryTree.results.map(renderNode)}
                </TreeSelect>
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Save Category
        </Button>
      </Form.Item>
    </Form>
  );
};

const CategoryForm = Form.create<IFormProps>()(CategoryFormComponent);

export default CategoryForm;

import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import ColorSelect from "../../components/form/ColorSelect";
import { Category } from "../../dao/categories";

const { Option } = Select;

interface FormProps {
  data?: Category;
  onSave: (values: Category) => Promise<void>;
}

const CategoryForm = ({ data, onSave }: FormProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState("first-child");

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await form.validateFields();
    } catch (e) {
      setSubmitting(false);
      return;
    }
    const newData: Category = {
      ...values
    };
    try {
      await onSave(newData);
    } catch (e) {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ set_color: data.my_color, set_icon: data.my_icon });
    }
  }, [data, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ position: "first-child", ...data }}
      size={isMobile ? "large" : "middle"}
    >
      <Row gutter={16}>
        <Col xs={4} sm={2}>
          <Form.Item name="set_icon" label="Icon">
            <Input placeholder="📗" style={{ textAlign: "center" }} />
          </Form.Item>
        </Col>
        <Col xs={20} sm={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter a name" }]}
          >
            <Input placeholder="Ledger" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="set_color" label="Color">
        <ColorSelect />
      </Form.Item>
      {!data && (
        <Row gutter={16}>
          <Col xs={10} sm={4}>
            <Form.Item name="position" label="Position" required>
              <Select onChange={value => setPosition(value as string)}>
                <Option value="first-child">Top of</Option>
                <Option value="last-child">Bottom of</Option>
                <Option value="left">Before</Option>
                <Option value="right">After</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={14} sm={10}>
            <Form.Item
              name="target"
              label={
                ["left", "right"].includes(position) ? "Neighbor" : "Parent"
              }
            >
              <CategorySelect
                placeholder={
                  ["left", "right"].includes(position)
                    ? "Select Neighbor"
                    : "Select Parent"
                }
                size={isMobile ? "large" : "middle"}
                dropdownPopupAlign={
                  isMobile ? { points: ["tr", "br"] } : undefined
                }
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block={isMobile}
        >
          Save Category
        </Button>
        <BrowserView>
          <Link
            to={
              (data && `/settings/categories/${data.pk}`) ??
              `/settings/categories`
            }
          >
            <Button>Discard</Button>
          </Link>
        </BrowserView>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;

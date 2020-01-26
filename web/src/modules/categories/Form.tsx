import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BrowserView, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import ColorSelect from "../../components/form/ColorSelect";
import { Category } from "../../dao/categories";
import { applyFormErrors } from "../../utils/errors";

const { Option } = Select;

interface FormProps {
  data?: Category;
  onSave: (values: Category) => Promise<void>;
}

const CategoryForm = ({ data, onSave }: FormProps) => {
  const [t] = useTranslation("categories");
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
    if (values.target) {
      values.target = values.target.value;
    }
    try {
      await onSave(values);
    } catch (error) {
      setSubmitting(false);
      applyFormErrors(form, error);
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
          <Form.Item name="set_icon" label={t("categories:icon", "Icon")}>
            <Input placeholder="📗" style={{ textAlign: "center" }} />
          </Form.Item>
        </Col>
        <Col xs={20} sm={12}>
          <Form.Item
            name="name"
            label={t("categories:name", "Name")}
            rules={[
              {
                required: true,
                message: t("categories:name_required", "Enter a name")
              }
            ]}
          >
            <Input placeholder={t("categories:name_placeholder", "Ledger")} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="set_color" label={t("categories:color", "Color")}>
        <ColorSelect />
      </Form.Item>
      {!data && (
        <Row gutter={16}>
          <Col xs={10} sm={4}>
            <Form.Item
              name="position"
              label={t("categories:position", "Position")}
              required
            >
              <Select onChange={value => setPosition(value as string)}>
                <Option value="first-child">
                  {t("categories:position_top_of", "Top of")}
                </Option>
                <Option value="last-child">
                  {t("categories:position_bottom_of", "Bottom of")}
                </Option>
                <Option value="left">
                  {t("categories:position_before", "Before")}
                </Option>
                <Option value="right">
                  {t("categories:position_after", "After")}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={14} sm={10}>
            <Form.Item
              name="target"
              label={
                ["left", "right"].includes(position)
                  ? t("categories:target_neighbor", "Neighbor")
                  : t("categories:target_parent", "Parent")
              }
            >
              <CategorySelect
                placeholder={
                  ["left", "right"].includes(position)
                    ? t(
                        "categories:target_neighbor_placeholder",
                        "Select Neighbor"
                      )
                    : t("categories:target_parent_placeholder", "Select Parent")
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
          {data
            ? t("categories:update", "Update Category")
            : t("categories:create", "Create Category")}
        </Button>
        <BrowserView>
          <Link
            to={
              (data && `/settings/categories/${data.pk}`) ??
              `/settings/categories`
            }
          >
            <Button>{t("translation:cancel", "Cancel")}</Button>
          </Link>
        </BrowserView>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;

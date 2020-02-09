import { Button, Input, message, Popconfirm, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import CategorySelect from "../../components/form/CategorySelect";
import { RelatedModel } from "../../dao/base";
import {
  bulkDeletePayees,
  deletePayee,
  Payee,
  postPayee,
  putPayee,
  usePayees
} from "../../dao/payees";
import { useSettings } from "../../utils/SettingsProvider";
import BaseEditableTable from "../base/BaseEditableTable";
import {
  BaseTableLocationState,
  getColumnFilter,
  getColumnSort
} from "../base/BaseTable";
import { EditableColumnsType } from "../base/EditableTable";

const PayeeTable = ({
  match,
  location
}: RouteComponentProps<{}, {}, BaseTableLocationState>) => {
  const [t] = useTranslation("payees");
  const { tableSize } = useSettings();
  const [doDelete] = useMutation(deletePayee, {
    refetchQueries: [["items/payees", { ...location.state, pageSize: 10 }]]
  });
  const [edit] = useMutation(putPayee);
  const [create] = useMutation(postPayee);
  const [bulkDelete] = useMutation(bulkDeletePayees, {
    refetchQueries: ["items/payees"]
  });

  const columns: EditableColumnsType<Payee> = [
    {
      title: t("payees:name", "Name"),
      dataIndex: "name",
      editable: true,
      formField: <Input autoFocus size={tableSize} />,
      render(name, tag) {
        return <Link to={`${match.url}/${tag.pk}`}>{name}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: t("payees:type", "Type"),
      dataIndex: "type",
      render(type) {
        return type === "business"
          ? t("payees:type_business", "Business")
          : t("payees:type_person", "Person");
      },
      editable: true,
      formField: (
        <Select size={tableSize}>
          <Select.Option value="business">
            {t("payees:type_business", "Business")}
          </Select.Option>
          <Select.Option value="private">
            {t("payees:type_person", "Person")}
          </Select.Option>
        </Select>
      ),
      filterMultiple: false,
      filters: [
        {
          value: "business",
          text: t("payees:type_business", "Business")
        },
        { value: "private", text: t("payees:type_person", "Person") }
      ],
      ...getColumnFilter("type", location.state)
    },
    {
      title: t("payees:default_category", "Default Category"),
      dataIndex: "default_category",
      render(category: RelatedModel) {
        return category ? (
          <Link to={`/settings/categories/${category.value}`}>
            {category.label}
          </Link>
        ) : null;
      },
      editable: true,
      formField: <CategorySelect allowClear />,
      rules: []
    }
  ];

  return (
    <BaseEditableTable<Payee>
      editable
      onSave={async payee => {
        const isNew = payee.pk === 0;
        if (!payee.default_category) {
          payee.default_category = null;
        }
        try {
          const savedPayee = isNew
            ? await create(payee)
            : await edit(payee, {
                updateQuery: ["item/payees", { pk: payee.pk }]
              });
          if (isNew) {
            message.success(t("payees:created", "Payee created"));
          } else {
            message.success(t("payees:updated", "Payee updated"));
          }
          return savedPayee;
        } catch (e) {
          if (isNew) {
            message.error(t("payees:create_error", "Payee create failed"));
          } else {
            message.error(t("payees:update_error", "Payee update failed"));
          }
          throw e;
        }
      }}
      defaultValues={{ type: "business" }}
      itemName={t("payees:payee", "Payee")}
      itemNamePlural={t("payees:payee_plural", "Payees")}
      useItems={usePayees}
      columns={columns}
      extraRowActions={payee => [
        <Popconfirm
          key="del"
          title={t("payees:delete", 'Delete Payee "{{ label }}"?', {
            label: payee.label
          })}
          okText={t("translation:delete", "Delete")}
          okButtonProps={{ type: "danger" }}
          cancelText={t("translation:cancel", "Cancel")}
          placement="left"
          onConfirm={async () => {
            await doDelete(payee);
            message.info(
              t("payees:deleted", 'Payee "{{ label }}" deleted', {
                label: payee.label
              })
            );
          }}
        >
          <Button type="link">{t("translation:delete", "Delete")}</Button>
        </Popconfirm>
      ]}
      bulkActions={[
        {
          key: "delete",
          name: t("payees:bulk.delete", "Delete selected payees"),
          async action(pks) {
            const { deleted } = await bulkDelete({ pks });
            message.info(
              t("payees:bulk.deleted", "Deleted {{ count }} payees", {
                count: deleted
              })
            );
          }
        }
      ]}
    />
  );
};

export default PayeeTable;

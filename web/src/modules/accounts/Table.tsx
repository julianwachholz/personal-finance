import { SwapOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ColumnsType } from "antd/lib/table/Table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Money from "../../components/data/Money";
import { Account, moveAccount, useAccounts } from "../../dao/accounts";
import BaseTable, {
  BaseTableLocationState,
  getColumnFilter,
  getColumnSort
} from "../base/BaseTable";
import { TransferModal } from "../transactions/TransferForm";

const AccountTable = ({
  match,
  location
}: RouteComponentProps<{}, {}, BaseTableLocationState>) => {
  const [t] = useTranslation("accounts");
  const [transferVisible, setTransferVisible] = useState(false);
  const [move] = useMutation(moveAccount, {
    refetchQueries: ["items/accounts"]
  });

  const columns: ColumnsType<Account> = [
    {
      title: t("accounts:name", "Name"),
      dataIndex: "name",
      render(_, account) {
        return <Link to={`${match.url}/${account.pk}`}>{account.label}</Link>;
      },
      ...getColumnSort("name", location.state)
    },
    {
      title: t("accounts:institution", "Institution"),
      dataIndex: "institution",
      ...getColumnSort("institution", location.state)
    },
    {
      title: t("accounts:balance", "Balance"),
      dataIndex: "balance",
      align: "right",
      filters: [
        { text: "SFr.", value: "currency=CHF" },
        { text: "€", value: "currency=EUR" },
        { text: "US$", value: "currency=USD" }
      ],
      render(balance, account) {
        return (
          <Money value={{ amount: balance, currency: account.currency }} />
        );
      },
      ...getColumnSort("balance", location.state),
      ...getColumnFilter("currency", location.state, true)
    },
    {
      align: "right",
      render(_, account) {
        return (
          <Link to={`${match.url}/${account.pk}/edit`}>
            {t("translation:inline.edit", "Edit")}
          </Link>
        );
      }
    }
  ];

  return (
    <BaseTable<Account>
      itemName={t("accounts:account", "Account")}
      itemNamePlural={t("accounts:account_plural", "Accounts")}
      useItems={useAccounts}
      columns={columns}
      isSortable
      onMove={(pk, pos) => {
        move({ pk, pos });
      }}
      actions={[
        <Button
          key="transfer"
          icon={<SwapOutlined />}
          onClick={() => {
            setTransferVisible(true);
          }}
        >
          {t("accounts:transfer", "Transfer")}
        </Button>,
        <Link key="create" to={`${match.url}/create`}>
          <Button type="primary">
            {t("accounts:create", "Create Account")}
          </Button>
        </Link>
      ]}
    >
      <TransferModal visible={transferVisible} onVisible={setTransferVisible} />
    </BaseTable>
  );
};

export default AccountTable;

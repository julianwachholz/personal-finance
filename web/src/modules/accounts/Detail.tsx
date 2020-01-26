import { FormOutlined } from "@ant-design/icons";
import { Button, Descriptions, Spin, Statistic } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";
import { CURRENCY_FORMATS } from "../../components/data/Money";
import { useAccount } from "../../dao/accounts";
import { prefetchTransactions } from "../../dao/transactions";
import { useAuth } from "../../utils/AuthProvider";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import RelatedTransactions from "../transactions/RelatedTransactions";

const { Item } = Descriptions;

interface DetailParams {
  pk: string;
}

const Account = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("accounts");
  const { settings } = useAuth();
  const { data: account, isLoading, error } = useAccount(match.params.pk);
  const filters = [`account=${match.params.pk}`];
  const currencyFormat = account && CURRENCY_FORMATS[account?.currency];

  // load related transactions in parallel
  prefetchTransactions({ filters });

  useTitle(account && account.label);
  return account ? (
    <BaseModule
      title={account.label}
      extra={[
        <Link key="edit" to={`${match.url}/edit`}>
          <Button type="primary">
            {t("accounts:edit_account", "Edit Account")}
          </Button>
        </Link>,
        <Link key="delete" to={`${match.url}/delete`}>
          <Button type="danger">
            {t("accounts:delete_account", "Delete Account")}
          </Button>
        </Link>
      ]}
      onLeftClick={() => {
        history.go(-1);
      }}
      rightContent={
        <FormOutlined
          onClick={() => {
            history.push(`${match.url}/edit`);
          }}
        />
      }
    >
      <Descriptions title={t("accounts:account", "Account")}>
        <Item label={t("accounts:name", "Name")}>{account.name}</Item>
        <Item label={t("accounts:icon", "Icon")}>{account.icon}</Item>
        <Item label={t("accounts:institution", "Institution")}>
          {account.institution}
        </Item>
      </Descriptions>
      <Statistic
        title={t("accounts:balance", "Balance")}
        value={account.balance}
        precision={2}
        groupSeparator={settings?.group_separator}
        decimalSeparator={settings?.decimal_separator}
        prefix={currencyFormat?.prefix}
        suffix={currencyFormat?.suffix}
      />
      <RelatedTransactions filters={filters} excludeColumns={["account"]} />
    </BaseModule>
  ) : (
    <Spin spinning={isLoading}>{error?.toString()}</Spin>
  );
};

export default Account;

import { BankOutlined } from "@ant-design/icons";
import { List } from "antd-mobile";
import { History } from "history";
import React from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import Fab from "../../components/button/Fab";
import Money from "../../components/data/Money";
import { Account, useAccounts } from "../../dao/accounts";
import { UseItemsPaginated } from "../../dao/base";
import BaseList from "../base/BaseList";

const renderAccount = (history: History, account: Account) => {
  return (
    <List.Item
      key={account.pk}
      thumb={<>{account.icon}</>}
      extra={
        <Money
          value={{ amount: account.balance, currency: account.currency }}
        />
      }
      onClick={() => {
        history.push(`/accounts/${account.pk}`);
      }}
    >
      {account.name}
      {account.institution && (
        <List.Item.Brief>{account.institution}</List.Item.Brief>
      )}
    </List.Item>
  );
};

const AccountList = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("accounts");

  return (
    <BaseList
      itemName={t("accounts:account", "Account")}
      itemNamePlural={t("accounts:account_plural", "Accounts")}
      useItems={useAccounts as UseItemsPaginated<Account>}
      renderRow={renderAccount.bind(null, history)}
      fab={
        <Fab
          icon={<BankOutlined />}
          onClick={() => {
            history.push(`/accounts/create`);
          }}
        />
      }
    />
  );
};

export default AccountList;

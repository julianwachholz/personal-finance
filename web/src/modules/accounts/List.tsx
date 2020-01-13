import { List } from "antd-mobile";
import { History } from "history";
import React from "react";
import { useHistory } from "react-router-dom";
import Money from "../../components/data/Money";
import { Account, useAccounts } from "../../dao/accounts";
import { UseItemsPaginated } from "../../dao/base";
import BaseList from "../base/BaseList";

const renderAccount = (history: History, account: Account) => {
  return (
    <List.Item
      extra={
        <Money
          value={{ amount: account.balance, currency: account.currency }}
        />
      }
      onClick={() => {
        history.push(`/accounts/${account.pk}`);
      }}
    >
      {account.label}
      <List.Item.Brief>{account.institution}</List.Item.Brief>
    </List.Item>
  );
};

const AccountsList = () => {
  const history = useHistory();
  // const [create] = useMutation(postTag);

  return (
    <BaseList
      itemName="Account"
      itemNamePlural="Accounts"
      useItems={useAccounts as UseItemsPaginated<Account>}
      renderRow={renderAccount.bind(null, history)}
    />
  );
};

export default AccountsList;

import { message, Spin } from "antd";
import React from "react";
import { useMutation } from "react-query";
import { RouteComponentProps, useHistory } from "react-router";
import { putAccount, useAccount } from "../../dao/accounts";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

interface DetailParams {
  pk: string;
}

const AccountEdit = ({ match }: RouteComponentProps<DetailParams>) => {
  const pk = parseInt(match.params.pk, 10);
  const { data: account, isLoading } = useAccount(pk);

  const [mutate] = useMutation(putAccount, {
    refetchQueries: ["items/accounts"]
  });
  const history = useHistory();
  useTitle(account && `Edit ${account.label}`);

  if (!account || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule title={`Edit ${account.label}`}>
      <AccountForm
        data={account}
        onSave={async data => {
          try {
            await mutate(
              { pk, ...data },
              { updateQuery: ["item/accounts", { pk }] }
            );
            message.success("Account updated");
            history.push(`/accounts/${pk}`);
          } catch (e) {
            message.error("Account update failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountEdit;

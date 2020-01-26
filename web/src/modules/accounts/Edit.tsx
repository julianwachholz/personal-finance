import { DeleteFilled } from "@ant-design/icons";
import { message, Spin } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { putAccount, useAccount } from "../../dao/accounts";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

interface DetailParams {
  pk: string;
}

const AccountEdit = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const [t] = useTranslation("accounts");
  const pk = parseInt(match.params.pk, 10);
  const { data: account, isLoading } = useAccount(pk);

  const [mutate] = useMutation(putAccount, {
    refetchQueries: ["items/accounts"]
  });

  useTitle(
    account && t("accounts:edit", "Edit {{ label }}", { label: account.label })
  );

  if (!account || isLoading) {
    return <Spin />;
  }

  return (
    <BaseModule
      title={t("accounts:edit", "Edit {{ label }}", { label: account.label })}
      onLeftClick={() => {
        history.go(-2);
      }}
      rightContent={
        <DeleteFilled
          onClick={() => {
            history.push(`/accounts/${pk}/delete`);
          }}
        />
      }
    >
      <AccountForm
        data={account}
        onSave={async data => {
          try {
            await mutate(
              { pk, ...data },
              { updateQuery: ["item/accounts", { pk }] }
            );
            message.success(t("accounts:updated", "Account updated"));
            history.push(`/accounts/${pk}`);
          } catch (e) {
            message.error(t("accounts:update_error", "Account update failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountEdit;

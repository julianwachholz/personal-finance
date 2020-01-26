import { message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { setQueryData, useMutation } from "react-query";
import { RouteComponentProps } from "react-router";
import { postAccount } from "../../dao/accounts";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

const AccountCreate = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("accounts");
  const [mutate] = useMutation(postAccount, {
    refetchQueries: ["items/accounts"]
  });

  useTitle(t("accounts:create", "Create Account"));
  return (
    <BaseModule
      title={t("accounts:create", "Create Account")}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <AccountForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/accounts", { pk: tag.pk }], tag);
            message.success(t("accounts:created", "Account created"));
            history.push(`/accounts`);
          } catch (e) {
            message.error(t("accounts:create_error", "Account create failed"));
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountCreate;

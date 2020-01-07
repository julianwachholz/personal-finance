import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postAccount } from "../../dao/accounts";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

const AccountCreate = () => {
  const [mutate] = useMutation(postAccount, {
    refetchQueries: ["items/accounts"]
  });
  const history = useHistory();

  return (
    <BaseModule title="Create Account">
      <AccountForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/accounts", { pk: tag.pk }], tag);
            message.success("Account created");
            history.push(`/accounts/${tag.pk}`);
          } catch (e) {
            message.error("Account creation failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountCreate;

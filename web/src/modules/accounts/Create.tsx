import { message } from "antd";
import React from "react";
import { setQueryData, useMutation } from "react-query";
import { useHistory } from "react-router";
import { postAccount } from "../../dao/accounts";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

const AccountCreate = () => {
  const [mutate] = useMutation(postAccount, {
    refetchQueries: ["items/accounts"]
  });
  const history = useHistory();

  useTitle(`Create Account`);
  return (
    <BaseModule
      title="Create Account"
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      <AccountForm
        onSave={async data => {
          try {
            const tag = await mutate(data);
            setQueryData(["item/accounts", { pk: tag.pk }], tag);
            message.success("Account created");
            history.push(`/accounts`);
          } catch (e) {
            message.error("Account create failed");
            throw e;
          }
        }}
      />
    </BaseModule>
  );
};

export default AccountCreate;

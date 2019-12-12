import React from "react";
import BaseModule from "../base/BaseModule";
import AccountForm from "./Form";

const AccountCreate: React.FC = () => (
  <BaseModule title="Create Account">
    <AccountForm
      onSave={() => {
        console.log("o hai");
      }}
    />
  </BaseModule>
);

export default AccountCreate;

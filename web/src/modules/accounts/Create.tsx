import React from "react";
import AccountForm from "./Form";

const AccountCreate: React.FC = () => (
  <AccountForm
    onSave={() => {
      console.log("o hai");
    }}
  />
);

export default AccountCreate;

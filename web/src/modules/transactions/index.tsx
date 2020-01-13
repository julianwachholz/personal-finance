import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import TransactionList from "./List";
import TransactionTable from "./Table";

const Transactions = isMobile ? TransactionList : TransactionTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={match.url} component={Transactions} />
  </Switch>
);

export default Module;

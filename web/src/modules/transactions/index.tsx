import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import TransactionCreate from "./Create";
import TransactionEdit from "./Edit";
import TransactionList from "./List";
import TransactionTable from "./Table";
import BalanceTransfer from "./Transfer";

const Transactions = isMobile ? TransactionList : TransactionTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={TransactionCreate} />
    <Route path={`${match.url}/transfer`} component={BalanceTransfer} />
    <Route path={`${match.url}/:pk`} component={TransactionEdit} />
    <Route path={match.url} component={Transactions} />
  </Switch>
);

export default Module;

import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import TransactionCreate from "./Create";
import Transactions from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={TransactionCreate} />
    <Route path={match.url} component={Transactions} />
  </Switch>
);

export default Module;

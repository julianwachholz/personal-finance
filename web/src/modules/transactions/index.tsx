import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Transactions from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={match.url} component={Transactions} />
  </Switch>
);

export default Module;

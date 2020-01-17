import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Budgets from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={match.url} component={Budgets} />
  </Switch>
);

export default Module;

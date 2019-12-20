import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Transactions from "./List";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={match.url} component={Transactions} />
  </Switch>
);

export default Module;

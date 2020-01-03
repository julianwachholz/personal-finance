import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Tag from "./Detail";
import Payees from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Payees} />
  </Switch>
);

export default Module;

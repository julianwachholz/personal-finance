import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Tag from "./Detail";
import Tags from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Tags} />
  </Switch>
);

export default Module;

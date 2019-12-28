import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import TagCreate from "./Create";
import Tag from "./Detail";
import TagEdit from "./Edit";
import Payees from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={TagCreate} />
    <Route path={`${match.url}/:pk/edit`} component={TagEdit} />
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Payees} />
  </Switch>
);

export default Module;

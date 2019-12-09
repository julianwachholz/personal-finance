import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AccountCreate from "./Create";
import Account from "./Detail";
import AccountEdit from "./Edit";
import Accounts from "./List";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/create`} component={AccountCreate} />
    <Route path={`${match.url}/:pk/edit`} component={AccountEdit} />
    <Route path={`${match.url}/:pk`} component={Account} />
    <Route path={match.url} component={Accounts} />
  </Switch>
);

export default Module;

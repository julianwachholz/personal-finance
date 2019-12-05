import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AccountCreate from "./Create";
import Account from "./Detail";
import AccountEdit from "./Edit";
import Accounts from "./List";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/new`} component={AccountCreate} />
    <Route path={`${match.path}/:pk/edit`} component={AccountEdit} />
    <Route path={`${match.path}/:pk`} component={Account} />
    <Route path={match.path} component={Accounts} />
  </Switch>
);

export default Module;

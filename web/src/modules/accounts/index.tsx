import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import AccountCreate from "./Create";
import Account from "./Detail";
import AccountEdit from "./Edit";
import Accounts from "./List";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={Accounts} />
    <Route path={`${match.url}/new`} component={AccountCreate} />
    <Route path={`${match.url}/:pk/edit`} component={AccountEdit} />
    <Route path={`${match.url}/:pk`} component={Account} />
  </Switch>
);

export default Module;

import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import AccountCreate from "./Create";
import AccountDelete from "./Delete";
import Account from "./Detail";
import AccountEdit from "./Edit";
import AccountsList from "./List";
import AccountsTable from "./Table";

const Accounts = isMobile ? AccountsList : AccountsTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={AccountCreate} />
    <Route path={`${match.url}/:pk/edit`} component={AccountEdit} />
    <Route path={`${match.url}/:pk/delete`} component={AccountDelete} />
    <Route path={`${match.url}/:pk`} component={Account} />
    <Route path={match.url} component={Accounts} />
  </Switch>
);

export default Module;

import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import PayeeCreate from "./Create";
import Tag from "./Detail";
import PayeeEdit from "./Edit";
import PayeeList from "./List";
import PayeeTable from "./Table";

const Payees = isMobile ? PayeeList : PayeeTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={PayeeCreate} />
    <Route path={`${match.url}/:pk/edit`} component={PayeeEdit} />
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Payees} />
  </Switch>
);

export default Module;

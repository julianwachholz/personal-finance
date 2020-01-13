import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import Tag from "./Detail";
import PayeesList from "./List";
import PayeesTable from "./Table";

const Payees = isMobile ? PayeesList : PayeesTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Payees} />
  </Switch>
);

export default Module;

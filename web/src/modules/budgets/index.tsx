import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import BudgetCreate from "./Create";
import BudgetEdit from "./Edit";
import Budgets from "./List";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={BudgetCreate} />
    <Route path={`${match.url}/:pk/edit`} component={BudgetEdit} />
    <Route path={match.url} component={Budgets} />
  </Switch>
);

export default Module;

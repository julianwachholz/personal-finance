import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import CategoryCreate from "./Create";
import CategoryDelete from "./Delete";
import Category from "./Detail";
import CategoryEdit from "./Edit";
import Categories from "./List";
import CategoryTree from "./Tree";

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/create`} component={CategoryCreate} />
    <Route path={`${match.url}/:pk/edit`} component={CategoryEdit} />
    <Route path={`${match.url}/:pk/delete`} component={CategoryDelete} />
    <Route path={`${match.url}/tree`} component={CategoryTree} />
    <Route path={`${match.url}/:pk`} component={Category} />
    <Route path={match.url} component={Categories} />
  </Switch>
);

export default Module;

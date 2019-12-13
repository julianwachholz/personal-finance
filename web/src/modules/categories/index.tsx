import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Category from "./Detail";
import Categories from "./List";
import CategoryTree from "./Tree";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    {/* <Route path={`${match.url}/create`} component={AccountCreate} /> */}
    {/* <Route path={`${match.url}/:pk/edit`} component={AccountEdit} /> */}
    <Route path={`${match.url}/tree`} component={CategoryTree} />
    <Route path={`${match.url}/:pk`} component={Category} />
    <Route path={match.url} component={Categories} />
  </Switch>
);

export default Module;

import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Tag from "./Detail";
import Tags from "./List";
import TagEdit from "./Edit";
import TagCreate from "./Create";

const Module: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/create`} component={TagCreate} />
    <Route path={`${match.url}/:pk/edit`} component={TagEdit} />
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Tags} />
  </Switch>
);

export default Module;

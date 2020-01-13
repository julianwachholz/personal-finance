import React from "react";
import { isMobile } from "react-device-detect";
import { Route, RouteComponentProps, Switch } from "react-router";
import Tag from "./Detail";
import TagList from "./List";
import TagTable from "./Table";

const Tags = isMobile ? TagList : TagTable;

const Module = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/:pk`} component={Tag} />
    <Route path={match.url} component={Tags} />
  </Switch>
);

export default Module;

import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories/Categories";
import Tags from "../tags/Tags";

const Settings: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route exact path={match.url} render={() => "Settings"} />
    <Route path={`${match.url}/categories`} component={Categories} />
    <Route path={`${match.url}/tags`} component={Tags} />
    <Route path={`${match.url}/options`} render={() => "Options"} />
    <Route path={`${match.url}/user`} render={() => "Profile"} />
  </Switch>
);

export default Settings;

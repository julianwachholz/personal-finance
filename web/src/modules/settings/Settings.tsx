import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories/Categories";
import Tags from "../tags/Tags";

const Settings: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/categories/`} component={Categories} />
    <Route path={`${match.path}/tags/`} component={Tags} />
    <Route path={`${match.path}/options/`} render={() => "Options"} />
    <Route path={`${match.path}/user/`} render={() => "Profile"} />
    <Route path={match.path} render={() => "Settings"} />
  </Switch>
);

export default Settings;

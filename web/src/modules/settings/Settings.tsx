import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories/List";
import Tags from "../tags";

const Settings: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/categories/`} component={Categories} />
    <Route path={`${match.url}/tags/`} component={Tags} />
    <Route path={`${match.url}/options/`} render={() => "Options"} />
    <Route path={`${match.url}/user/`} render={() => "Profile"} />
    <Route path={match.url} render={() => "Settings"} />
  </Switch>
);

export default Settings;

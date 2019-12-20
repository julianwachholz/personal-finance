import React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories";
import Options from "../options";
import Profile from "../profile";
import Tags from "../tags";

const Settings: React.FC<RouteComponentProps> = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/categories`} component={Categories} />
    <Route path={`${match.url}/tags`} component={Tags} />
    <Route path={`${match.url}/options`} component={Options} />
    <Route path={`${match.url}/user`} component={Profile} />
    <Route
      path={match.url}
      render={() => <Redirect to="/settings/options" />}
    />
  </Switch>
);

export default Settings;

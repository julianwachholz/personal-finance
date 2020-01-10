import React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories";
import Payees from "../payees";
import Preferences from "../preferences";
import Profile from "../profile";
import Tags from "../tags";

const Settings = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/categories`} component={Categories} />
    <Route path={`${match.url}/tags`} component={Tags} />
    <Route path={`${match.url}/payees`} component={Payees} />
    <Route path={`${match.url}/preferences`} component={Preferences} />
    <Route path={`${match.url}/user`} component={Profile} />
    <Route
      path={match.url}
      render={() => <Redirect to="/settings/preferences" />}
    />
  </Switch>
);

export default Settings;

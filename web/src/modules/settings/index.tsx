import React, { lazy } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";

const Categories = lazy(() => import("../categories"));
const Payees = lazy(() => import("../payees"));
const Preferences = lazy(() => import("../preferences"));
const Profile = lazy(() => import("../profile"));
const Tags = lazy(() => import("../tags"));
const SettingsMenu = lazy(() => import("./Menu"));

const Settings = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route path={`${match.url}/categories`} component={Categories} />
    <Route path={`${match.url}/tags`} component={Tags} />
    <Route path={`${match.url}/payees`} component={Payees} />
    <Route path={`${match.url}/preferences`} component={Preferences} />
    <Route path={`${match.url}/user`} component={Profile} />
    <Route path={match.url} component={SettingsMenu} />
  </Switch>
);

export default Settings;

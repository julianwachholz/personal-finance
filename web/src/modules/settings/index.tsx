import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import Categories from "../categories";
import Payees from "../payees";
import Preferences from "../preferences";
import Profile from "../profile";
import Tags from "../tags";
import SettingsMenu from "./Menu";

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

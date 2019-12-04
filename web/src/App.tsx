import "antd/dist/antd.css";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/Layout";
import Accounts from "./modules/accounts";
import Dashboard from "./modules/dashboard/Dashboard";
import NotFound from "./modules/error/NotFound";
import Settings from "./modules/settings/Settings";
import Transactions from "./modules/transactions/Transactions";

const App: React.FC = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/reports" render={() => "Reports"} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/budgets" render={() => "Budgets"} />
      <Route path="/settings" component={Settings} />
      <Route exact path="/404" component={NotFound} />
      <Route render={() => <Redirect to="/404" />} />
    </Switch>
  </AppLayout>
);

export default App;

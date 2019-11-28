import "antd/dist/antd.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/Layout";
import Dashboard from "./modules/dashboard/Dashboard";
import Transactions from "./modules/transactions/Transactions";

const App: React.FC = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/reports" render={() => "Reports"} />
      <Route path="/accounts" render={() => "Accounts"} />
      <Route path="/budgets" render={() => "Budgets"} />
      <Route path="/settings/categories" render={() => "Categories"} />
      <Route path="/settings/tags" render={() => "Tags"} />
      <Route path="/settings/options" render={() => "Options"} />
      <Route path="/settings/user" render={() => "Profile"} />
    </Switch>
  </AppLayout>
);

export default App;

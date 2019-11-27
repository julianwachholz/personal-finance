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
    </Switch>
  </AppLayout>
);

export default App;

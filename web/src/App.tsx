import { Spin } from "antd";
import "antd/dist/antd.css";
import React, { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import AppLayout from "./components/layout/Layout";
import MobileLayout from "./components/layout/MobileLayout";
import Accounts from "./modules/accounts";
import Login from "./modules/auth/Login";
import Budgets from "./modules/budgets";
import Dashboard from "./modules/dashboard/Dashboard";
import NotFound from "./modules/error/NotFound";
import Reports from "./modules/reports";
import Settings from "./modules/settings/Settings";
import Transactions from "./modules/transactions";
import { useAuth } from "./utils/AuthProvider";
import { useSettings } from "./utils/SettingsProvider";

const App = () => {
  const { theme } = useSettings();
  const { isAuthenticated, isLoading } = useAuth();
  const Layout = isMobile ? MobileLayout : AppLayout;

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`app--${isMobile ? "mobile" : "web"}`);
    document.body.classList.add(`app--${theme}`);
  }, [theme, isMobile]);

  if (isLoading) {
    return (
      <div className={`app-loading app--${theme}`}>
        <Spin delay={100} size="large" tip="Loading..." />
      </div>
    );
  }

  return isAuthenticated ? (
    <Layout>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/reports" component={Reports} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/budgets" component={Budgets} />
        <Route path="/settings" component={Settings} />
        <Route exact path="/404" component={NotFound} />
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    </Layout>
  ) : (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/recover" render={() => <p>Forgot password</p>} />
      <Route path="/register" render={() => <p>Register</p>} />
      <Route render={() => <Redirect to="/login" />} />
    </Switch>
  );
};

export default App;

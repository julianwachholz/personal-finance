import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "antd/dist/antd.css";
import React, { lazy, Suspense, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Route, Switch } from "react-router-dom";
import "./App.scss";
import GuestLayout from "./components/layout/GuestLayout";
import AppLayout from "./components/layout/Layout";
import MobileLayout from "./components/layout/MobileLayout";
import BaseModule from "./modules/base/BaseModule";
import NotFound from "./modules/error/NotFound";
import { useAuth } from "./utils/AuthProvider";
import ErrorBoundary from "./utils/ErrorBoundary";
import { useSettings } from "./utils/SettingsProvider";

// Lazy components
const Accounts = lazy(() => import("./modules/accounts"));
const Budgets = lazy(() => import("./modules/budgets"));
const Dashboard = lazy(() => import("./modules/dashboard"));
const Reports = lazy(() => import("./modules/reports"));
const Settings = lazy(() => import("./modules/settings"));
const Transactions = lazy(() => import("./modules/transactions"));

// Lazy components (unauthenticated)
const Login = lazy(() => import("./modules/auth/Login"));
const VerifyEmail = lazy(() => import("./modules/auth/VerifyEmail"));
const Register = lazy(() => import("./modules/auth/Register"));

const App = () => {
  const { theme } = useSettings();
  const { isAuthenticated, isLoading } = useAuth();
  const Layout = isMobile ? MobileLayout : AppLayout;

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`app--${isMobile ? "mobile" : "web"}`);
    document.body.classList.add(`app--${theme}`);
    !isAuthenticated && document.body.classList.add(`app--guest`);
  }, [theme, isAuthenticated]);

  if (isLoading) {
    return (
      <div className={`app-loading app--${theme}`}>
        <Spin
          delay={100}
          size="large"
          indicator={<LoadingOutlined />}
          tip="Loading..."
        />
      </div>
    );
  }

  const fallback = isMobile ? (
    <BaseModule title={document.title.replace(" - Shinywaffle", "")}>
      <div className="app-loading">
        <Spin
          delay={100}
          size="large"
          indicator={<LoadingOutlined />}
          tip="Loading..."
        />
      </div>
    </BaseModule>
  ) : (
    <Spin delay={100} tip="Loading..." />
  );

  return isAuthenticated ? (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/reports" component={Reports} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/budgets" component={Budgets} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  ) : (
    <GuestLayout>
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/verify/:token" component={VerifyEmail} />
            <Route path="/recover" render={() => <p>Forgot password</p>} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </GuestLayout>
  );
};

export default App;

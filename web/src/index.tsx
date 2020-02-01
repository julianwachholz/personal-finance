import * as Sentry from "@sentry/browser";
import { message } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import { createProviderTreeFromList } from "react-provider-tree";
import { ReactQueryConfigProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { prefetchUser } from "./dao/user";
import i18n from "./i18n";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "./utils/AuthProvider";
import { SettingsProvider } from "./utils/SettingsProvider";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_RELEASE
});

const ProviderTree = createProviderTreeFromList(
  [ReactQueryConfigProvider, { config: { retry: 2, staleTime: 500 } }],
  [SettingsProvider, {}],
  [AuthProvider, {}]
);

const AppWrapper = () => (
  <BrowserRouter>
    <ProviderTree>
      <App />
    </ProviderTree>
  </BrowserRouter>
);

prefetchUser();

const rootEl = document.getElementById("root");
ReactDOM.render(<AppWrapper />, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate() {
    console.log("onUpdate");
    message.info({
      content: i18n.t(
        "pwa.update",
        "Update available. Reload the page to apply."
      ),
      duration: 0,
      onClose() {
        window.location.reload();
      }
    });
  },
  onSuccess() {
    console.log("onSuccess");
    message.info(i18n.t("pwa.success", "App ready for offline use!"));
  }
});

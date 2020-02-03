import * as Sentry from "@sentry/browser";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createProviderTreeFromList } from "react-provider-tree";
import { ReactQueryConfigProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { prefetchUser } from "./dao/user";
import "./i18n";
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
  [AuthProvider, {}]
);

const AppWrapper = () => {
  const [canUpdate, setCanUpdate] = useState(false);

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.register({
    onSuccess() {
      // TODO
    },
    onUpdate() {
      setCanUpdate(true);
      // setRegistration(registration);
    }
  });

  const updateApp = canUpdate
    ? () => {
        navigator.serviceWorker.ready.then(registration => {
          console.log("service worker ready");
          const registrationWaiting = registration.waiting;
          if (registrationWaiting) {
            console.log("service worker waiting");
            registrationWaiting.addEventListener("statechange", (e: any) => {
              if (e.target.state === "activated") {
                window.location.reload();
              }
            });
            registrationWaiting.postMessage({ type: "SKIP_WAITING" });
          } else {
            console.log("service worker not waiting");
          }
        });
      }
    : undefined;

  return (
    <BrowserRouter>
      <ProviderTree>
        <SettingsProvider updateApp={updateApp}>
          <App />
        </SettingsProvider>
      </ProviderTree>
    </BrowserRouter>
  );
};

prefetchUser();

const rootEl = document.getElementById("root");
ReactDOM.render(<AppWrapper />, rootEl);

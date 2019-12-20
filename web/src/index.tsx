import React from "react";
import ReactDOM from "react-dom";
import { createProviderTreeFromList } from "react-provider-tree";
import { ReactQueryConfigProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { SettingsProvider } from "./utils/SettingsProvider";

const ProviderTree = createProviderTreeFromList(
  [ReactQueryConfigProvider, { config: { retry: 2, staleTime: 500 } }],
  [SettingsProvider, {}]
);

const AppWrapper: React.FC = () => (
  <BrowserRouter>
    <ProviderTree>
      <App />
    </ProviderTree>
  </BrowserRouter>
);

const rootEl = document.getElementById("root");
ReactDOM.render(<AppWrapper />, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

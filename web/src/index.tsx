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
  [BrowserRouter, {}],
  [ReactQueryConfigProvider, { suspense: true, staleTime: 100 }],
  [SettingsProvider, {}]
);

const AppWrapper: React.FC = () => (
  <ProviderTree>
    <App />
  </ProviderTree>
);

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl!);
root.render(<AppWrapper />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

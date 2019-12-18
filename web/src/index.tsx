import React from "react";
import ReactDOM from "react-dom";
import {
  ReactQueryConfigProvider,
  ReactQueryProviderConfig
} from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const reactQueryConfig: ReactQueryProviderConfig = {
  retry: 2,
  staleTime: 1000,
  suspense: true
};

const AppWrapper: React.FC = () => (
  <ReactQueryConfigProvider config={reactQueryConfig}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactQueryConfigProvider>
);

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl!);
root.render(<AppWrapper />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

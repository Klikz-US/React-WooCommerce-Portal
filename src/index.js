import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import Store from "./store";
import * as serviceWorker from "./serviceWorker";

import "./assets/css/index.css";

// window.$server_url = "http://localhost:4080"; // For Development
window.$server_url = "https://cleanairportal.klikz.us:4443"; // For Production

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();

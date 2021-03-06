import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import Routes from "./components/Routes";
import store from "./redux/";

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("app")
);

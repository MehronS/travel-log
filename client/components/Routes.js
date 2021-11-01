import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import CountryList from "./CountryList";
import LoginPage from "./LoginPage";

function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/dashboard" component={CountryList} />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;

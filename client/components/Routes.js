import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import CountryList from "./CountryList";
import LoginPage from "./LoginPage";
import SingleCountry from "./SingleCountry";

function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/dashboard/:id" component={CountryList} />
          <Route
            exact
            path="/dashboard/country/:name"
            component={SingleCountry}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;

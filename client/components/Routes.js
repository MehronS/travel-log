import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import CountryList from "./CountryList";
import LoginPage from "./LoginPage";
import SingleCountry from "./SingleCountry";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/dashboard/:id" component={CountryList} />
        <Route
          exact
          path="/dashboard/country/:name/user/:userId"
          component={SingleCountry}
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default Routes;

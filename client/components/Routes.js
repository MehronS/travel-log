import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import CountryList from "./CountryList";
import LoginPage from "./LoginPage";
import SingleCountry from "./SingleCountry";
import TripPlanner from "./TripPlanner";

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
        <Route exact path="/plan-trip/:name/:userId" component={TripPlanner} />
      </Switch>
    </Router>
  );
}

export default Routes;

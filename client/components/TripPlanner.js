import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry, fetchTripCountryInfo } from "../redux/countries";
import { fetchSingleUserWithId } from "../redux/users";
import LoadingSpinner from "./LoadingSpinner";

let myMap;

class TripPlanner extends Component {
  constructor() {
    super();
    this.state = {
      country: ``,
      tripInfo: ``,
    };
  }

  async componentDidMount() {
    try {
      await this.props.getSingleCountry(this.props.countryName);
      await this.props.getTripInfo(this.props.countryName);
      await this.props.getSingleUser(this.props.userId);

      this.setState({
        country: this.props.country,
        tripInfo: this.props.tripInfo,
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadLanguages() {
    let output = [];
    const languages = this.state.country.languages;
    for (let key in languages) output.push(`${languages[key]},`);

    let lastword = output[output.length - 1];

    lastword = lastword.slice(0, lastword.length - 1);
    output[output.length - 1] = lastword;

    return output;
  }

  render() {
    const tripInfo = this.state.tripInfo.data;
    const countryName = tripInfo ? tripInfo.attributes.name : null;

    return (
      <div>
        {!tripInfo ? (
          <LoadingSpinner />
        ) : (
          <div className="trip_plan_div">
            <div className="trip_info">
              <fieldset className="to_consider">
                <h3>
                  Average Rating:{" "}
                  {Number(tripInfo.attributes.average_rating.toFixed(2))
                    ? tripInfo.attributes.average_rating.toFixed(2)
                    : "N/A"}
                </h3>
                <h3>
                  Languages:{" "}
                  {this.loadLanguages().map((lang) => (
                    <span key={lang}>{lang} </span>
                  ))}{" "}
                </h3>
                <h3>
                  Covid Status:{" "}
                  <a
                    href={`${tripInfo.attributes.covid[countryName].url}`}
                    target="_blank"
                  >
                    {tripInfo.attributes.covid[countryName].text}
                  </a>
                </h3>
                <div className="safety_div">
                  <h3>
                    Safety: {tripInfo.attributes.safety[countryName].text}
                  </h3>
                  <h4>{tripInfo.attributes.safety[countryName].subText}</h4>
                </div>
                <div className="cost_div">
                  <h3>
                    Average Cost: {tripInfo.attributes.budget[countryName].text}
                  </h3>
                  <h4>{tripInfo.attributes.budget[countryName].subText}</h4>
                </div>
              </fieldset>

              <div className="visit_cities">
                <h2>Cities To Visit!</h2>
                {tripInfo.attributes.top_cities_and_towns.map((city) => {
                  return (
                    <div key={city.id} className="city">
                      {city.name.split(`,`)[0]}
                    </div>
                  );
                })}
              </div>
              <div className="trip_links">
                <h4>
                  <a
                    href={tripInfo.attributes.google_events_url}
                    target="_blank"
                  >
                    Upcoming Events
                  </a>
                </h4>
                <h4>
                  <a
                    href={tripInfo.attributes.getyourguide_url}
                    target="_blank"
                  >
                    Get Your Guide
                  </a>
                </h4>
                <h4>
                  <a href={tripInfo.attributes.airbnb_url} target="_blank">
                    Airbnb
                  </a>
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tripInfo: state.countries.tripInfo,
    country: state.countries.singleCountry,
    singleUser: state.users.singleUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTripInfo: (countryName) => dispatch(fetchTripCountryInfo(countryName)),
    getSingleUser: (id) => dispatch(fetchSingleUserWithId(id)),
    getSingleCountry: (countryName) =>
      dispatch(fetchSingleCountry(countryName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripPlanner);

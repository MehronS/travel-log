import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry, fetchTripCity } from "../redux/locations";
import { fetchSingleUserWithId } from "../redux/users";
import CityOrState from "./CityOrState";
import LoadingSpinner from "./LoadingSpinner";

class TripPlanner extends Component {
  constructor() {
    super();
    this.state = {
      country: ``,
      tripInfo: ``,
      city: ``,
      loadCity: false,
    };

    this.loadCity = this.loadCity.bind(this);
    this.toggleCityOff = this.toggleCityOff.bind(this);
  }

  async componentDidMount() {
    try {
      await this.props.getSingleCountry(this.props.countryName);
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
    // API returns country laguages in an object, so made a function to put it into an array to parse over
    let output = [];
    const languages = this.state.country.languages;
    for (let key in languages) output.push(`${languages[key]},`);

    // a bunch of code just to remove the comma from the last country on the list
    let lastword = output[output.length - 1];

    lastword = lastword.slice(0, lastword.length - 1);
    output[output.length - 1] = lastword;

    return output;
  }

  // go to the CityOrState component
  async loadCity(cityName, cityId) {
    try {
      await this.props.getCity(cityName, cityId);
      this.setState({
        city: this.props.singleCity,
        loadCity: true,
      });
    } catch (error) {}
  }

  // brings back to the TripPlanner component instead of the single City
  toggleCityOff() {
    const country = this.props.country;
    this.setState({ loadCity: false });
    this.props.loadMarker(country.latlng[0], country.latlng[1]);
  }

  render() {
    const tripInfo = this.state.tripInfo.data;
    const countryName = tripInfo ? tripInfo.attributes.name : null;

    return (
      <div>
        {this.state.loadCity ? (
          <CityOrState
            toggleCity={this.toggleCityOff}
            city={this.props.singleCity}
            countryName={countryName}
            loadMarker={this.props.loadMarker}
          />
        ) : (
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
                        Average Cost:{" "}
                        {tripInfo.attributes.budget[countryName].text}
                      </h3>
                      <h4>{tripInfo.attributes.budget[countryName].subText}</h4>
                    </div>
                  </fieldset>

                  <div className="visit_cities">
                    <h2>Places To Visit!</h2>
                    {tripInfo.attributes.top_cities_and_towns.map((city) => {
                      return (
                        <div
                          key={city.id}
                          className="city"
                          onClick={() =>
                            this.loadCity(city.name.split(`,`)[0], city.id)
                          }
                        >
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
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    country: state.countries.singleCountry,
    singleUser: state.users.singleUser,
    singleCity: state.countries.singleCity,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleUser: (id) => dispatch(fetchSingleUserWithId(id)),
    getSingleCountry: (countryName) =>
      dispatch(fetchSingleCountry(countryName)),
    getCity: (cityName, cityId) => dispatch(fetchTripCity(cityName, cityId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripPlanner);

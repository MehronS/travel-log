import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry, fetchTripCountryInfo } from "../redux/countries";
import { fetchSingleUserWithId } from "../redux/users";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";

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
      await this.props.getSingleCountry(this.props.match.params.name);
      await this.props.getTripInfo(this.props.match.params.name);

      this.setState({
        country: this.props.country,
        tripInfo: this.props.tripInfo,
      });

      this.loadmap();
    } catch (error) {
      console.error(error);
    }
  }

  loadmap() {
    const country = this.props.country;
    myMap = L.map("map", {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 4,
      scrollWheelZoom: false,
    }).setView([country.latlng[0], country.latlng[1]], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png").addTo(
      myMap
    );

    this.loadMarker();
  }

  loadMarker() {
    const country = this.props.country;
    return L.marker([
      country.capitalInfo.latlng[0],
      country.capitalInfo.latlng[1],
    ]).addTo(myMap);
  }

  loadLanguages() {
    let output = [];
    const languages = this.state.country.languages;
    for (let key in languages) output.push(languages[key]);
    return output;
  }

  render() {
    const { country } = this.state;
    const tripInfo = this.state.tripInfo.data;
    const countryName = tripInfo ? tripInfo.attributes.name : null;
    console.log(`from trip planner`, this.state);

    return (
      <div>
        {!tripInfo ? (
          <LoadingSpinner />
        ) : (
          <div className="trip_plan_div">
            <Navbar userId={this.props.match.params.userId} />
            <div className="singleCountryDiv">
              <fieldset id="map" className="singleCountryMap"></fieldset>

              <fieldset className="singleCountryInfo">
                <h1>{country.name.common}</h1>
                <img src={country.coatOfArms.png} height="100px" />
                <h3>Capital: {country.capital}</h3>
                <img src={country.flags.png} />
              </fieldset>
            </div>
            <div className="trip_info">
              <fieldset className="to_consider">
                <h3>
                  Average Rating:{" "}
                  {tripInfo.attributes.average_rating.toFixed(2)}
                </h3>
                <h3>
                  Languages:{" "}
                  {this.loadLanguages().map((lang) => (
                    <span key={lang}>{lang} </span>
                  ))}{" "}
                </h3>
                <h3>
                  Covid Info:{" "}
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

              <div className="visit_cities to_consider">
                <h2>Cities To Visit!</h2>
                {tripInfo.attributes.top_cities_and_towns.map((city) => {
                  return (
                    <div key={city.id} className="city">
                      {city.name.split(`,`)[0]}
                    </div>
                  );
                })}

                <div className="to_consider trip_links">
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

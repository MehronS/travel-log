import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry } from "../redux/countries";
import { fetchSingleUser } from "../redux/users";

let myMap;

class SingleCountry extends Component {
  constructor() {
    super();
    this.state = {
      singleCountry: ``,
    };
  }

  async componentDidMount() {
    try {
      await this.props.getSingleCountry(this.props.match.params.name);
      this.setState({ singleCountry: this.props.singleCountry });

      this.loadmap();
      this.loadMarker();
    } catch (error) {
      console.error(error);
    }
  }

  loadmap() {
    const country = this.props.singleCountry;
    myMap = L.map("map", {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 4,
    }).setView([country.latlng[0], country.latlng[1]], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png").addTo(
      myMap
    );
  }

  loadMarker() {
    const country = this.props.singleCountry;
    return L.marker([
      country.capitalInfo.latlng[0],
      country.capitalInfo.latlng[1],
    ]).addTo(myMap);
  }

  render() {
    console.log(`from single country`, this.state.singleCountry);
    const country = this.state.singleCountry
      ? this.state.singleCountry
      : undefined;

    return (
      <div>
        {country ? (
          <div className="singleCountryDiv">
            <div id="map" className="singleCountryMap"></div>
            <div className="singleCountryInfo">
              <h1>{country.name.common}</h1>
              <img src={country.coatOfArms.png} height="100px" />
              <h3>Capital: {country.capital}</h3>
              <img src={country.flags.png} />
              <h3>Population: {country.population}</h3>
            </div>
          </div>
        ) : (
          <p>Loading</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    singleCountry: state.countries.singleCountry,
    singleUser: state.users.singleUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleCountry: (countryName) =>
      dispatch(fetchSingleCountry(countryName)),
    getSingleUser: (id) => dispatch(fetchSingleUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCountry);

import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry } from "../redux/countries";
import { fetchSingleUser, fetchUserPicturesAtLocation } from "../redux/users";

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
      console.log(
        `from mount`,
        this.props.match.params.name,
        this.props.singleUser.id
      );
      const locationName = { locationName: this.props.match.params.name };
      await this.props.getUserPictures(4, locationName);
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
      scrollWheelZoom: false,
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
    console.log(`from single country`, this.props.userPictures);
    const country = this.state.singleCountry
      ? this.state.singleCountry
      : undefined;

    return (
      <div>
        {country ? (
          <div>
            <form>
              <label>Add Your Pictures</label>
              <input />
              <button>Submit</button>
            </form>
            <div className="singleCountryDiv">
              <fieldset id="map" className="singleCountryMap"></fieldset>

              <fieldset className="singleCountryInfo">
                <h1>{country.name.common}</h1>
                <img src={country.coatOfArms.png} height="100px" />
                <h3>Capital: {country.capital}</h3>
                <img src={country.flags.png} />
                <h3>
                  Population:{" "}
                  {country.population
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </h3>
              </fieldset>
            </div>
            {this.props.userPictures
              ? this.props.userPictures.map((link) => {
                  return (
                    <img
                      src={link.imageUrl}
                      key={link.id}
                      className="countryImages"
                    />
                  );
                })
              : null}
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
    userPictures: state.users.userPicturesAtLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleCountry: (countryName) =>
      dispatch(fetchSingleCountry(countryName)),
    getSingleUser: (id) => dispatch(fetchSingleUser(id)),
    getUserPictures: (userId, locationName) =>
      dispatch(fetchUserPicturesAtLocation(userId, locationName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCountry);

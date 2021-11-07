import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry } from "../redux/locations";
import {
  deleteUserPictureAtLocation,
  fetchSingleUser,
  fetchSingleUserWithId,
  fetchUserPicturesAtLocation,
  updateUserPicturesAtLocation,
} from "../redux/users";
import CountryPictures from "./CountryPictures";
import LoadingSpinner from "./LoadingSpinner";
import ModalPictures from "./ModalPictures";
import Navbar from "./nav/Navbar";
import TripPlanner from "./TripPlanner";

let myMap;

class SingleCountry extends Component {
  constructor() {
    super();
    this.state = {
      singleCountry: ``,
      imageUrl: ``,
      showModal: false,
      singleImage: ``,
      tripPlan: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.planTrip = this.planTrip.bind(this);
  }

  async componentDidMount() {
    const token = window.localStorage.getItem(`token`);
    try {
      if (token) {
        await this.props.getSingleCountry(this.props.match.params.name);
        const locationName = { locationName: this.props.match.params.name };
        const userId = this.props.match.params.userId;
        await this.props.getUserPictures(userId, locationName);
        this.setState({ singleCountry: this.props.singleCountry });

        await this.props.getSingleUser(userId);
        this.loadmap();
      } else {
        alert(`nah fam`);
        this.props.history.push(`/`);
      }
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

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(myMap);

    this.loadMarker();
  }

  loadMarker() {
    const country = this.props.singleCountry;
    return L.marker([
      country.capitalInfo.latlng[0],
      country.capitalInfo.latlng[1],
    ]).addTo(myMap);
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.state.imageUrl) return alert(`Please Input Image Url`);
    try {
      const userId = this.props.match.params.userId;
      const locationInfo = {
        imageUrl: this.state.imageUrl,
        locationName: this.props.match.params.name,
      };

      this.props.updatePictures(userId, locationInfo);
      this.setState({ imageUrl: `` });
    } catch (error) {
      console.error(error);
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  toggleModal(imageId) {
    const image = this.props.userPictures.filter(
      (image) => image.id === imageId
    );

    this.setState({
      showModal: !this.state.showModal,
      singleImage: image[0],
    });

    if (this.state.showModal)
      setTimeout(() => {
        this.loadmap();
        this.loadMarker();
      }, 50);
  }

  async handleDelete(id) {
    const locationName = { locationName: this.props.match.params.name };
    const userId = this.props.match.params.userId;
    try {
      await this.props.deletePicture(id);
      await this.props.getUserPictures(userId, locationName);
    } catch (error) {
      console.error(error);
    }
  }

  planTrip() {
    this.setState({ tripPlan: !this.state.tripPlan });
  }

  render() {
    const country = this.state.singleCountry
      ? this.state.singleCountry
      : undefined;

    return (
      <div>
        {this.state.showModal ? (
          <ModalPictures
            image={this.state.singleImage}
            toggleModal={this.toggleModal}
          />
        ) : (
          <div>
            <Navbar
              userId={this.props.match.params.userId}
              name={this.props.singleUser.firstName}
            />
            {country ? (
              <div>
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

                    <button
                      className="login_buttons plan_trip_button"
                      onClick={this.planTrip}
                    >
                      {this.state.tripPlan
                        ? `Your ${country.name.common} Pictures`
                        : `Plan A Trip to ${country.name.common}!`}
                    </button>
                  </fieldset>
                </div>

                {this.state.tripPlan ? (
                  <TripPlanner
                    userId={this.props.match.params.userId}
                    countryName={country.name.common}
                  />
                ) : (
                  <CountryPictures
                    userPictures={this.props.userPictures}
                    handleDelete={this.handleDelete}
                    toggleModal={this.toggleModal}
                    handleSubmit={this.handleSubmit}
                    state={this.state}
                    handleChange={this.handleChange}
                    country={country}
                  />
                )}
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
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
    getSingleUser: (id) => dispatch(fetchSingleUserWithId(id)),
    getUserPictures: (userId, locationName) =>
      dispatch(fetchUserPicturesAtLocation(userId, locationName)),
    updatePictures: (userId, pictureInfo) =>
      dispatch(updateUserPicturesAtLocation(userId, pictureInfo)),
    deletePicture: (id) => dispatch(deleteUserPictureAtLocation(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCountry);

{
  /* <button
                  className="trip_back_button login_buttons"
                  onClick={() =>
                    this.props.history.push(
                      `/dashboard/country/${country.name.common}/user/${this.props.match.params.userId}`
                    )
                  }
                >
                  Back To Your Pictures
                </button> */
}

import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry } from "../redux/countries";
import {
  deleteUserPictureAtLocation,
  fetchSingleUser,
  fetchSingleUserWithId,
  fetchUserPicturesAtLocation,
  updateUserPicturesAtLocation,
} from "../redux/users";
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
      tripPlan: false,
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
        {this.state.tripPlan ? (
          <TripPlanner
            planTrip={this.planTrip}
            country={this.props.singleCountry}
            user={this.props.singleUser}
          />
        ) : this.state.showModal ? (
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
                  </fieldset>
                </div>
                <fieldset className="single_country_input_div">
                  <h3>Your Photos from {country.name.common}!!</h3>
                  <h3>Add More</h3>
                  <div>
                    <input
                      autoFocus
                      placeholder="Input URL Here"
                      name="imageUrl"
                      className="imageUrl"
                      onChange={this.handleChange}
                      value={this.state.imageUrl}
                    />
                    <button
                      className="login_buttons"
                      onClick={(e) => this.handleSubmit(e)}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="plan_trip_div">
                    <button
                      className="login_buttons"
                      onClick={() =>
                        this.props.history.push(
                          `/plan-trip/${country.name.common}/${this.props.match.params.userId}`
                        )
                      }
                    >
                      Plan A Trip to {country.name.common}!
                    </button>
                  </div>
                </fieldset>

                <div className="imageDiv">
                  {this.props.userPictures
                    ? this.props.userPictures
                        .sort((a, b) => a.id - b.id)
                        .map((image) => {
                          return (
                            <fieldset key={image.id} className="imageField">
                              <button
                                className="delete_button_picture"
                                onClick={() => this.handleDelete(image.id)}
                              >
                                Delete
                              </button>
                              <img
                                src={image.imageUrl}
                                className="countryImages"
                                onClick={() => this.toggleModal(image.id)}
                              />
                            </fieldset>
                          );
                        })
                    : null}
                </div>
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

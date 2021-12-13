import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry, fetchTripCountryInfo } from "../redux/locations";
import {
  deleteUserPictureAtLocation,
  fetchSingleUserWithId,
  fetchUserPicturesAtLocation,
  updateUserPicturesAtLocation,
  uploadUserPicturesAtLocation,
} from "../redux/users";
import CountryPictures from "./CountryPictures";
import LoadingSpinner from "./LoadingSpinner";
import ModalPictures from "./ModalPictures";
import Navbar from "./nav/Navbar";
import TripPlanner from "./TripPlanner";

// need these since several leaflet function need to reference the map and maker
let myMap, marker;

class SingleCountry extends Component {
  constructor() {
    super();
    this.state = {
      singleCountry: ``,
      imageUrl: ``,
      showModal: false,
      singleImage: ``,
      tripPlan: false,
      images: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.planTrip = this.planTrip.bind(this);
    this.loadMarker = this.loadMarker.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  async componentDidMount() {
    const token = window.localStorage.getItem(`token`); // get token to verify

    try {
      if (token) {
        await this.props.getSingleCountry(this.props.match.params.name);
        const locationName = { locationName: this.props.match.params.name };
        const userId = this.props.match.params.userId;
        await this.props.getUserPictures(userId, locationName); // make the call to the picuture route
        this.setState({ singleCountry: this.props.singleCountry });

        await this.props.getTripInfo(this.state.singleCountry.name.common);

        await this.props.getSingleUser(userId);
        const country = this.props.singleCountry;
        this.loadmap();
        // load at the Capital City marker
        this.loadMarker(
          country.capitalInfo.latlng[0],
          country.capitalInfo.latlng[1]
        );
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
    }).setView([country.latlng[0], country.latlng[1]], 4);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(myMap);
  }

  loadMarker(lat, lng) {
    if (marker) {
      myMap.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(myMap);
    myMap.flyTo([lat, lng], 7, {
      animate: true,
      pan: {
        duration: 2,
      },
    });
    return marker;
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

  async handleUpload(e) {
    try {
      e.preventDefault();
      const locationName = { locationName: this.props.match.params.name };
      const userId = this.props.match.params.userId;

      // get the images uploaded by user. Comes as an object of objects. annoying.. gotta use for in loop in back end
      let files = document.getElementsByTagName("input")[0].files;

      // const body = new FormData(); // to be able to send files via axios
      // body.append("images", files);
      // console.log(body);

      await this.props.uploadImages(
        userId,
        this.props.match.params.name,
        files
      );

      this.props.getUserPictures(userId, locationName);
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

  // change from single picture to full view
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
        const country = this.props.singleCountry;

        this.loadmap();
        this.loadMarker(
          country.capitalInfo.latlng[0],
          country.capitalInfo.latlng[1]
        );
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

  // loads the TripPlanner component based on true/false
  planTrip() {
    this.setState({ tripPlan: !this.state.tripPlan });
  }

  render() {
    const countryWiki = this.props.tripInfo ? this.props.tripInfo.data : ""; // working around errors popping up before tripInfo loads
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
                    <h1>
                      <a
                        target="_blank"
                        href={
                          countryWiki
                            ? countryWiki.attributes.wikipedia_url
                            : `loading`
                        }
                      >
                        {country.name.common}
                      </a>
                    </h1>
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
                    loadMarker={this.loadMarker}
                    userId={this.props.match.params.userId}
                    countryName={country.name.common}
                    tripInfo={this.props.tripInfo}
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
                    handleUpload={this.handleUpload}
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
    tripInfo: state.countries.tripInfo,
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
    getTripInfo: (countryName) => dispatch(fetchTripCountryInfo(countryName)),
    uploadImages: (userId, locationName, files) =>
      dispatch(uploadUserPicturesAtLocation(userId, locationName, files)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCountry);

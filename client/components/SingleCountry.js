import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSingleCountry } from "../redux/countries";
import {
  fetchSingleUser,
  fetchUserPicturesAtLocation,
  updateUserPicturesAtLocation,
} from "../redux/users";
import ModalPictures from "./ModalPictures";
import Navbar from "./Navbar";

let myMap;

class SingleCountry extends Component {
  constructor() {
    super();
    this.state = {
      singleCountry: ``,
      imageUrl: ``,
      showModal: false,
      singleImage: ``,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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

        this.loadmap();
        this.loadMarker();
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
      }, 50);

    console.log(`from toggle`, this.state);
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
            <Navbar userId={this.props.match.params.userId} />
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
                <form>
                  <h3>
                    Your Photos from {this.props.singleCountry.name.common}
                  </h3>
                  <h3>Add More</h3>
                  <input
                    placeholder="Input URL Here"
                    name="imageUrl"
                    onChange={this.handleChange}
                    value={this.state.imageUrl}
                  />
                  <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
                </form>

                {this.props.userPictures
                  ? this.props.userPictures.map((link) => {
                      return (
                        <fieldset key={link.id} className="imageField">
                          <img
                            src={link.imageUrl}
                            className="countryImages"
                            onClick={() => this.toggleModal(link.id)}
                          />
                        </fieldset>
                      );
                    })
                  : null}
              </div>
            ) : (
              <p>Loading</p>
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
    getSingleUser: (id) => dispatch(fetchSingleUser(id)),
    getUserPictures: (userId, locationName) =>
      dispatch(fetchUserPicturesAtLocation(userId, locationName)),
    updatePictures: (userId, pictureInfo) =>
      dispatch(updateUserPicturesAtLocation(userId, pictureInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCountry);

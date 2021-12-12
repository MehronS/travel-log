import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchAddSingleCountry,
  fetchAllCountries,
  fetchSingleCountry,
} from "../redux/locations";
import {
  fetchSingleUserWithId,
  removeSingleCountryFromUser,
} from "../redux/users";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./nav/Navbar";
import L from "leaflet";
import geoData from "./../../geo-data/countries.json";

// need these since several leaflet function need to reference the map and maker
let myMap;

class CountryList extends Component {
  constructor() {
    super();
    this.state = {
      allCountries: [],
      beenTo: [],
      countryName: ``,
      singleUser: ``,
    };

    this.addMarker = this.addMarker.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onEachCountry = this.onEachCountry.bind(this);
  }

  async componentDidMount() {
    const token = window.localStorage.getItem(`token`);

    let beenToPlaces = [];
    try {
      if (token) {
        // Authenticate Token

        await this.props.getSingleUser(this.props.match.params.id);
        // ping REST Countries API for every location on users selections
        await Promise.all(
          this.props.singleUser.locations.map(async (location) => {
            const { data } = await axios.get(
              `https://restcountries.com/v3.1/name/${location.name}`
            );
            beenToPlaces.push(...data);
          })
        );

        // Get all the countries
        await this.props.getAllCountries();
        let sorted = [...this.props.countries];
        sorted = sorted.sort((a, b) => {
          if (a.name.common < b.name.common) return -1;
          if (a.name.common > b.name.common) return 1;
          return 0;
        });
        this.setState({
          allCountries: sorted,
          beenTo: beenToPlaces,
        });

        this.loadmap();
        this.loadMarkers();
      } else {
        alert(`please log in`);
        this.props.history.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // load all users locations markers
  loadMarkers() {
    this.state.beenTo.map((country) => {
      let myIcon = L.icon({
        iconUrl: country.flags.png,
        iconSize: [30, 30],
        // iconAnchor: [22, 94],
      });
      const marker = L.marker([country.latlng[0], country.latlng[1]], {
        icon: myIcon,
      })
        .addTo(myMap)
        .bindPopup(
          `<div class="openPopup">
          <h3>Open</h3>
          <h3>${country.flag}${country.name.common}${country.flag}</h3>
          </div>
          <button class="popupDelete">Remove</button>`
        )
        .on(`popupopen`, () => {
          // direct click from popup to single country page
          document
            .querySelector(".openPopup")
            .addEventListener(`click`, (e) => {
              e.preventDefault();
              this.props.history.push(
                `/dashboard/country/${country.name.common}/user/${this.props.singleUser.id}`
              );
            });

          // Remove country from users location list
          document
            .querySelector(".popupDelete")
            .addEventListener(`click`, () => {
              this.handleRemove(country.name.common, this.props.singleUser.id);
              myMap.removeLayer(marker);
            });
        });
    });
  }

  // load a marker when Submit is clicked with a selected country on a drop down
  loadSingleMarker() {
    let country = this.props.singleCountry;
    let myIcon = L.icon({
      iconUrl: country.flags.png,
      iconSize: [30, 30],
      autoPan: true,
    });

    const marker = L.marker([country.latlng[0], country.latlng[1]], {
      icon: myIcon,
    })
      .addTo(myMap)
      .bindPopup(
        `<div class="popupDiv openPopup">
        <h3>Open</h3>
        <h3 >${country.flag}${country.name.common}${country.flag}
        </div>
        </h3><button class="popupDelete">Remove</button>`
      )
      .on(`popupopen`, () => {
        // direct click from popup to single country page
        document.querySelector(".openPopup").addEventListener(`click`, (e) => {
          e.preventDefault();
          this.props.history.push(
            `/dashboard/country/${country.name.common}/user/${this.props.singleUser.id}`
          );
        });

        // Remove country from users location list
        document.querySelector(".popupDelete").addEventListener(`click`, () => {
          this.handleRemove(country.name.common, this.props.singleUser.id);
          myMap.removeLayer(marker);
        });
      })
      .openPopup();

    // moves the map to the new country selected
    myMap.flyTo([country.latlng[0], country.latlng[1]], 4, {
      animate: true,
      pan: {
        duration: 2,
      },
    });

    //reset input field
    this.setState({ countryName: `` });
  }

  // initially load the leaflet map
  loadmap() {
    myMap = L.map("map", {
      minZoom: 3,
      worldCopyJump: true,
    }).setView([0, 0], 0);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(myMap);

    L.geoJSON(geoData, {
      weight: 1,
      fillOpacity: 0.0,
      // color: "black",
      // fillColor: "red",
      onEachFeature: this.onEachCountry,
    }).addTo(myMap);
  }

  onEachCountry(country, layer) {
    layer.on("click", (e) => {
      this.addMarker(country.properties.ADMIN);
      // e.target.setStyle({
      //   color: "green",
      //   // fillColor: "blue",
      //   fillOpacity: 0.5,
      // });
    });
  }

  // create a marker layer on the map
  async addMarker(countryName) {
    if (!countryName) return alert(`Please Select Country`);
    else {
      await this.props.addSingleCountry(countryName, {
        id: this.props.match.params.id,
      });

      this.setState({
        beenTo: [...this.state.beenTo, this.props.singleCountry],
      });

      // call the load single marker to put marker visually on the map
      this.loadSingleMarker();
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  // take out the country from the map and user
  async handleRemove(countryName, userId) {
    try {
      // remove country association from user
      await this.props.removeCountry(countryName, userId);
      let beenToPlaces = [];

      //  re-render the users current locations after the removal
      await this.props.getSingleUser(this.props.match.params.id);
      await Promise.all(
        this.props.singleUser.locations.map(async (location) => {
          const { data } = await axios.get(
            `https://restcountries.com/v3.1/name/${location.name}`
          );
          beenToPlaces.push(...data);
        })
      );

      this.setState({ beenTo: beenToPlaces, countryName: `` });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // helps getting list into a variable to make terneries to prevent page loading errors
    const countryList =
      this.state.beenTo === []
        ? []
        : this.state.beenTo.map((country) => country.name.common);

    const unvisitedCountries =
      countryList !== [] && this.state.allCountries !== []
        ? this.state.allCountries.filter(
            (country) => !countryList.includes(country.name.common)
          )
        : this.state.allCountries;

    return (
      <>
        <Navbar
          name={this.props.singleUser.firstName}
          userId={this.props.match.params.id}
        />

        {!this.state.allCountries.length ? (
          <LoadingSpinner />
        ) : (
          <div className="mapContainer">
            <div className="country_selector">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // if (!this.state.countryName) return;
                  this.addMarker(this.state.countryName);
                }}
              >
                <input
                  list="suggestions"
                  className="selector"
                  onChange={this.handleChange}
                  value={this.state.countryName}
                  name="countryName"
                />
                <datalist id="suggestions">
                  {unvisitedCountries.map((country) => {
                    return (
                      <option key={country.cca2} value={country.name.common}>
                        {country.name.common}
                      </option>
                    );
                  })}
                </datalist>
              </form>
            </div>

            <div id="map" className="mainMap"></div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    countries: state.countries.countries,
    singleCountry: state.countries.singleCountry,
    singleUser: state.users.singleUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCountries: () => dispatch(fetchAllCountries()),
    getSingleCountry: (countryName) =>
      dispatch(fetchSingleCountry(countryName)),
    getSingleUser: (id) => dispatch(fetchSingleUserWithId(id)),
    addSingleCountry: (countryName, id) =>
      dispatch(fetchAddSingleCountry(countryName, id)),
    removeCountry: (countryName, id) =>
      dispatch(removeSingleCountryFromUser(countryName, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryList);

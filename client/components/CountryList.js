import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchAddSingleCountry,
  fetchAllCountries,
  fetchSingleCountry,
} from "../redux/countries";
import {
  fetchSingleUserWithId,
  removeSingleCountryFromUser,
} from "../redux/users";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";

let counter = 0;
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
  }

  async componentDidMount() {
    const token = window.localStorage.getItem(`token`);

    let beenToPlaces = [];
    try {
      if (token) {
        await this.props.getSingleUser(this.props.match.params.id);
        await Promise.all(
          this.props.singleUser.locations.map(async (location) => {
            const { data } = await axios.get(
              `https://restcountries.com/v3.1/name/${location.name}`
            );
            beenToPlaces.push(...data);
          })
        );

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
        alert(`nah fam`);
        this.props.history.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // async componentDidUpdate(prevProps) {
  // let beenToPlaces = [];
  // try {
  //   if (prevProps.singleUser.locations !== this.state.singleUser.locations) {
  //     await this.props.getSingleUser(this.props.match.params.id);
  //     await Promise.all(
  //       this.props.singleUser.locations.map(async (location) => {
  //         const { data } = await axios.get(
  //           `https://restcountries.com/v3.1/name/${location.name}`
  //         );
  //         beenToPlaces.push(...data);
  //       })
  //     );

  //       await this.props.getAllCountries();
  //       let sorted = [...this.props.countries];
  //       sorted = sorted.sort((a, b) => {
  //         if (a.name.common < b.name.common) return -1;
  //         if (a.name.common > b.name.common) return 1;
  //         return 0;
  //       });
  //       this.setState({
  //         allCountries: sorted,
  //         beenTo: beenToPlaces,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

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
          `<div class="popupDiv">
          <h3 class="openPopup">${country.flag}${country.name.common}${country.flag}</h3><button class="popupDelete">Remove</button>
          </div>`
        )
        .on(`popupopen`, () => {
          document
            .querySelector(".openPopup")
            .addEventListener(`click`, (e) => {
              e.preventDefault();
              this.props.history.push(
                `/dashboard/country/${country.name.common}/user/${this.props.singleUser.id}`
              );
            });

          document
            .querySelector(".popupDelete")
            .addEventListener(`click`, () => {
              this.handleRemove(country.name.common, this.props.singleUser.id);
              myMap.removeLayer(marker);
            });
        });
    });
  }

  loadSingleMarker() {
    let country = this.props.singleCountry;
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
        `<div class="popupDiv">
        <h3 class="openPopup">${country.flag}${country.name.common}${country.flag}</h3><button class="popupDelete">Remove</button>
        </div>`
      )
      .on(`popupopen`, () => {
        document.querySelector(".openPopup").addEventListener(`click`, (e) => {
          e.preventDefault();
          this.props.history.push(
            `/dashboard/country/${country.name.common}/user/${this.props.singleUser.id}`
          );
        });

        document.querySelector(".popupDelete").addEventListener(`click`, () => {
          this.handleRemove(country.name.common, this.props.singleUser.id);
          myMap.removeLayer(marker);
        });
      });
  }

  loadmap() {
    myMap = L.map("map", {
      minZoom: 3,
      // zoomControl: false,
    }).setView([0, 0], 0);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png").addTo(
      myMap
    );
  }

  async addMarker(countryName) {
    if (!countryName) return alert(`Please Select Country`);
    else {
      await this.props.addSingleCountry(countryName, {
        id: this.props.match.params.id,
      });

      this.setState({
        beenTo: [...this.state.beenTo, this.props.singleCountry],
      });

      this.loadSingleMarker();
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleRemove(countryName, userId) {
    try {
      await this.props.removeCountry(countryName, userId);
      let beenToPlaces = [];

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
      <div>
        {!this.state.allCountries.length ? (
          <LoadingSpinner />
        ) : (
          <div className="country_list_div">
            <Navbar userId={this.props.singleUser.id} />
            <div>
              <div className="country_selector_div">
                <div>
                  Welcome, {this.props.singleUser.firstName}! Add Countries You
                  Have Visited or Want to Visit!
                </div>
                <div>
                  {
                    <select
                      onChange={this.handleChange}
                      value={this.state.countryName}
                      name="countryName"
                    >
                      <option></option>
                      {unvisitedCountries.map((country) => {
                        counter++;
                        return (
                          <option key={counter} value={country.name.common}>
                            {country.name.common}
                          </option>
                        );
                      })}
                    </select>
                  }
                  <button
                    onClick={() => this.addMarker(this.state.countryName)}
                    className="login_buttons country_list_button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div id="map" className="mainMap"></div>
          </div>
        )}
      </div>
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

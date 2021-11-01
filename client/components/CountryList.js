import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAllCountries, fetchSingleCountry } from "../redux/countries";
import { fetchSingleUser, fetchSingleUserWithId } from "../redux/users";

let counter = 0;
let myMap;

class CountryList extends Component {
  constructor() {
    super();
    this.state = {
      allCountries: [],
      beenTo: [],
      countryName: {},
    };

    this.addMarker = this.addMarker.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    let beenToPlaces = [];
    try {
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
      this.loadmap();
      this.setState({
        allCountries: this.props.countries,
        beenTo: beenToPlaces,
      });

      this.loadMarkers();
    } catch (error) {
      console.error(error);
    }
  }

  loadMarkers() {
    this.state.beenTo.map((country) =>
      L.marker([country.latlng[0], country.latlng[1]]).addTo(myMap)
    );
  }

  loadSingleMarker() {
    L.marker([
      this.props.singleCountry.latlng[0],
      this.props.singleCountry.latlng[1],
    ]).addTo(myMap);

    console.log(this.state.beenTo);
  }

  loadmap() {
    myMap = L.map("map", {
      minZoom: 2.5,
      // zoomControl: false,
    }).setView([0, 0], 0);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png").addTo(
      myMap
    );
  }

  async addMarker(countryName) {
    await this.props.getSingleCountry(countryName);

    this.setState({
      beenTo: [...this.state.beenTo, this.props.singleCountry],
    });

    this.loadSingleMarker();
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  render() {
    console.log(`from render props`, this.props.match);
    return (
      <div>
        {this.state.allCountries.length !== 0 ? (
          <select
            onChange={this.handleChange}
            value={this.state.countryName}
            name="countryName"
          >
            <option></option>
            {this.state.allCountries.map((country) => {
              counter++;
              return (
                <option key={counter} value={country.name.common}>
                  {country.name.official}
                </option>
              );
            })}
          </select>
        ) : (
          <h1>Loading...</h1>
        )}
        <button onClick={() => this.addMarker(this.state.countryName)}>
          Submit
        </button>
        <div id="map"></div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryList);

const dummy = [
  {
    name: {
      common: "Italy",
      official: "Italian Republic",
      nativeName: {
        ita: {
          official: "Repubblica italiana",
          common: "Italia",
        },
      },
    },
    tld: [".it"],
    cca2: "IT",
    ccn3: "380",
    cca3: "ITA",
    cioc: "ITA",
    independent: true,
    status: "officially-assigned",
    unMember: true,
    currencies: {
      EUR: {
        name: "Euro",
        symbol: "€",
      },
    },
    idd: {
      root: "+3",
      suffixes: ["9"],
    },
    capital: ["Rome"],
    altSpellings: ["IT", "Italian Republic", "Repubblica italiana"],
    region: "Europe",
    subregion: "Southern Europe",
    languages: {
      ita: "Italian",
    },
    translations: {
      ara: {
        official: "الجمهورية الإيطالية",
        common: "إيطاليا",
      },
      ces: {
        official: "Italská republika",
        common: "Itálie",
      },
      cym: {
        official: "Italian Republic",
        common: "Italy",
      },
      deu: {
        official: "Italienische Republik",
        common: "Italien",
      },
      est: {
        official: "Itaalia Vabariik",
        common: "Itaalia",
      },
      fin: {
        official: "Italian tasavalta",
        common: "Italia",
      },
      fra: {
        official: "République italienne",
        common: "Italie",
      },
      hrv: {
        official: "talijanska Republika",
        common: "Italija",
      },
      hun: {
        official: "Olasz Köztársaság",
        common: "Olaszország",
      },
      ita: {
        official: "Repubblica italiana",
        common: "Italia",
      },
      jpn: {
        official: "イタリア共和国",
        common: "イタリア",
      },
      kor: {
        official: "이탈리아 공화국",
        common: "이탈리아",
      },
      nld: {
        official: "Italiaanse Republiek",
        common: "Italië",
      },
      per: {
        official: "جمهوری ایتالیا",
        common: "ایتالیا",
      },
      pol: {
        official: "Republika Włoska",
        common: "Włochy",
      },
      por: {
        official: "República Italiana",
        common: "Itália",
      },
      rus: {
        official: "итальянская Республика",
        common: "Италия",
      },
      slk: {
        official: "Talianska republika",
        common: "Taliansko",
      },
      spa: {
        official: "República Italiana",
        common: "Italia",
      },
      swe: {
        official: "Republiken Italien",
        common: "Italien",
      },
      urd: {
        official: "جمہوریہ اطالیہ",
        common: "اطالیہ",
      },
      zho: {
        official: "意大利共和国",
        common: "意大利",
      },
    },
    latlng: [42.83333333, 12.83333333],
    landlocked: false,
    borders: ["AUT", "FRA", "SMR", "SVN", "CHE", "VAT"],
    area: 301336,
    demonyms: {
      eng: {
        f: "Italian",
        m: "Italian",
      },
      fra: {
        f: "Italienne",
        m: "Italien",
      },
    },
    flag: "🇮🇹",
    maps: {
      googleMaps: "https://goo.gl/maps/8M1K27TDj7StTRTq8",
      openStreetMaps: "https://www.openstreetmap.org/relation/365331",
    },
    population: 59554023,
    gini: {
      2017: 35.9,
    },
    fifa: "ITA",
    car: {
      signs: ["I"],
      side: "right",
    },
    timezones: ["UTC+01:00"],
    continents: ["Europe"],
    flags: {
      png: "https://flagcdn.com/w320/it.png",
      svg: "https://flagcdn.com/it.svg",
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/it.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/it.svg",
    },
    startOfWeek: "monday",
    capitalInfo: {
      latlng: [41.9, 12.48],
    },
    postalCode: {
      format: "#####",
      regex: "^(\\d{5})$",
    },
  },
  {
    name: {
      common: "Cayman Islands",
      official: "Cayman Islands",
      nativeName: {
        eng: {
          official: "Cayman Islands",
          common: "Cayman Islands",
        },
      },
    },
    tld: [".ky"],
    cca2: "KY",
    ccn3: "136",
    cca3: "CYM",
    cioc: "CAY",
    independent: false,
    status: "officially-assigned",
    unMember: false,
    currencies: {
      KYD: {
        name: "Cayman Islands dollar",
        symbol: "$",
      },
    },
    idd: {
      root: "+1",
      suffixes: ["345"],
    },
    capital: ["George Town"],
    altSpellings: ["KY"],
    region: "Americas",
    subregion: "Caribbean",
    languages: {
      eng: "English",
    },
    translations: {
      ara: {
        official: "جزر كايمان",
        common: "جزر كايمان",
      },
      ces: {
        official: "Kajmanské ostrovy",
        common: "Kajmanské ostrovy",
      },
      cym: {
        official: "Ynysoedd Cayman",
        common: "Ynysoedd Cayman",
      },
      deu: {
        official: "Cayman-Inseln",
        common: "Kaimaninseln",
      },
      est: {
        official: "Kaimanisaared",
        common: "Kaimanisaared",
      },
      fin: {
        official: "Caymansaaret",
        common: "Caymansaaret",
      },
      fra: {
        official: "Îles Caïmans",
        common: "Îles Caïmans",
      },
      hrv: {
        official: "Kajmanski otoci",
        common: "Kajmanski otoci",
      },
      hun: {
        official: "Kajmán-szigetek",
        common: "Kajmán-szigetek",
      },
      ita: {
        official: "Isole Cayman",
        common: "Isole Cayman",
      },
      jpn: {
        official: "ケイマン諸島",
        common: "ケイマン諸島",
      },
      kor: {
        official: "케이맨 제도",
        common: "케이맨 제도",
      },
      nld: {
        official: "Caymaneilanden",
        common: "Caymaneilanden",
      },
      per: {
        official: "جزایر کیمن",
        common: "جزایر کیمن",
      },
      pol: {
        official: "Kajmany",
        common: "Kajmany",
      },
      por: {
        official: "Ilhas Cayman",
        common: "Ilhas Caimão",
      },
      rus: {
        official: "Каймановы острова",
        common: "Каймановы острова",
      },
      slk: {
        official: "Kajmanie ostrovy",
        common: "Kajmanie ostrovy",
      },
      spa: {
        official: "Islas Caimán",
        common: "Islas Caimán",
      },
      swe: {
        official: "Caymanöarna",
        common: "Caymanöarna",
      },
      urd: {
        official: "جزائر کیمین",
        common: "جزائر کیمین",
      },
      zho: {
        official: "开曼群岛",
        common: "开曼群岛",
      },
    },
    latlng: [19.5, -80.5],
    landlocked: false,
    area: 264,
    demonyms: {
      eng: {
        f: "Caymanian",
        m: "Caymanian",
      },
      fra: {
        f: "Caïmanienne",
        m: "Caïmanien",
      },
    },
    flag: "🇰🇾",
    maps: {
      googleMaps: "https://goo.gl/maps/P3ZVXX3LH63t91hL8",
      openStreetMaps: "https://www.openstreetmap.org/relation/7269765",
    },
    population: 65720,
    fifa: "CAY",
    car: {
      signs: ["GB"],
      side: "left",
    },
    timezones: ["UTC-05:00"],
    continents: ["North America"],
    flags: {
      png: "https://flagcdn.com/w320/ky.png",
      svg: "https://flagcdn.com/ky.svg",
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/ky.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/ky.svg",
    },
    startOfWeek: "monday",
    capitalInfo: {
      latlng: [19.3, -81.38],
    },
  },
  {
    name: {
      common: "United Arab Emirates",
      official: "United Arab Emirates",
      nativeName: {
        ara: {
          official: "الإمارات العربية المتحدة",
          common: "دولة الإمارات العربية المتحدة",
        },
      },
    },
    tld: [".ae", "امارات."],
    cca2: "AE",
    ccn3: "784",
    cca3: "ARE",
    cioc: "UAE",
    independent: true,
    status: "officially-assigned",
    unMember: true,
    currencies: {
      AED: {
        name: "United Arab Emirates dirham",
        symbol: "د.إ",
      },
    },
    idd: {
      root: "+9",
      suffixes: ["71"],
    },
    capital: ["Abu Dhabi"],
    altSpellings: ["AE", "UAE", "Emirates"],
    region: "Asia",
    subregion: "Western Asia",
    languages: {
      ara: "Arabic",
    },
    translations: {
      ara: {
        official: "الإمارات العربية المتحدة",
        common: "دولة الإمارات العربية المتحدة",
      },
      ces: {
        official: "Spojené arabské emiráty",
        common: "Spojené arabské emiráty",
      },
      cym: {
        official: "United Arab Emirates",
        common: "United Arab Emirates",
      },
      deu: {
        official: "Vereinigte Arabische Emirate",
        common: "Vereinigte Arabische Emirate",
      },
      est: {
        official: "Araabia Ühendemiraadid",
        common: "Araabia Ühendemiraadid",
      },
      fin: {
        official: "Yhdistyneet arabiemiirikunnat",
        common: "Arabiemiraatit",
      },
      fra: {
        official: "Émirats arabes unis",
        common: "Émirats arabes unis",
      },
      hrv: {
        official: "Ujedinjeni Arapski Emirati",
        common: "Ujedinjeni Arapski Emirati",
      },
      hun: {
        official: "Egyesült Arab Emírségek",
        common: "Egyesült Arab Emírségek",
      },
      ita: {
        official: "Emirati Arabi Uniti",
        common: "Emirati Arabi Uniti",
      },
      jpn: {
        official: "アラブ首長国連邦",
        common: "アラブ首長国連邦",
      },
      kor: {
        official: "아랍 토후국 연방",
        common: "아랍에미리트",
      },
      nld: {
        official: "Verenigde Arabische Emiraten",
        common: "Verenigde Arabische Emiraten",
      },
      per: {
        official: "امارات متحده عربی",
        common: "امارات",
      },
      pol: {
        official: "Zjednoczone Emiraty Arabskie",
        common: "Zjednoczone Emiraty Arabskie",
      },
      por: {
        official: "Emirados Árabes Unidos",
        common: "Emirados Árabes Unidos",
      },
      rus: {
        official: "Объединенные Арабские Эмираты",
        common: "Объединённые Арабские Эмираты",
      },
      slk: {
        official: "Spojené arabské emiráty",
        common: "Spojené arabské emiráty",
      },
      spa: {
        official: "Emiratos Árabes Unidos",
        common: "Emiratos Árabes Unidos",
      },
      swe: {
        official: "Förenade Arabemiraten",
        common: "Förenade Arabemiraten",
      },
      urd: {
        official: "متحدہ عرب امارات",
        common: "متحدہ عرب امارات",
      },
      zho: {
        official: "阿拉伯联合酋长国",
        common: "阿拉伯联合酋长国",
      },
    },
    latlng: [24, 54],
    landlocked: false,
    borders: ["OMN", "SAU"],
    area: 83600,
    demonyms: {
      eng: {
        f: "Emirati",
        m: "Emirati",
      },
      fra: {
        f: "Emirienne",
        m: "Emirien",
      },
    },
    flag: "🇦🇪",
    maps: {
      googleMaps: "https://goo.gl/maps/AZZTDA6GzVAnKMVd8",
      openStreetMaps: "https://www.openstreetmap.org/relation/307763",
    },
    population: 9890400,
    gini: {
      2018: 26,
    },
    fifa: "UAE",
    car: {
      signs: ["UAE"],
      side: "right",
    },
    timezones: ["UTC+04"],
    continents: ["Asia"],
    flags: {
      png: "https://flagcdn.com/w320/ae.png",
      svg: "https://flagcdn.com/ae.svg",
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/ae.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/ae.svg",
    },
    startOfWeek: "sunday",
    capitalInfo: {
      latlng: [24.47, 54.37],
    },
  },
];

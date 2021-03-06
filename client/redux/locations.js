import axios from "axios";

// Action Types
const SET_ALL_COUNTRIES = `SET_ALL_COUNTRIES`;
const SET_SINGLE_COUNTRY = `SET_SINGLE_COUNTRY`;
const SET_TRIP_INFO = `SET_TRIP_INFO`;
const SET_SINGLE_CITY = `SET_SINGLE_CITY`;

// Action Creators
export const setCountries = (countries) => {
  return {
    type: SET_ALL_COUNTRIES,
    countries,
  };
};

export const setSingleCountry = (singleCountry) => {
  return {
    type: SET_SINGLE_COUNTRY,
    singleCountry,
  };
};

export const setTripInfo = (tripInfo) => {
  return {
    type: SET_TRIP_INFO,
    tripInfo,
  };
};

export const setSingleCity = (city) => {
  return {
    type: SET_SINGLE_CITY,
    city,
  };
};

// Thunks

export const fetchAllCountries = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/countries`);

      dispatch(setCountries(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchSingleCountry = (countryName) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/countries/${countryName}`);
      dispatch(setSingleCountry(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchAddSingleCountry = (countryName, userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`api/countries/${countryName}`, userId);

      dispatch(setSingleCountry(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchTripCountryInfo = (countryName) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/countries/trip/${countryName}/`);
      dispatch(setTripInfo(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchTripCity = (cityName, cityId) => {
  const city = { cityId };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`api/countries/city/${cityName}`, city);
      dispatch(setSingleCity(data));
    } catch (error) {
      console.error(error);
    }
  };
};

const initialState = {
  countries: [],
  singleCountry: {},
  tripInfo: {},
  singleCity: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_COUNTRIES:
      return { ...state, countries: action.countries };
    case SET_SINGLE_COUNTRY:
      return { ...state, singleCountry: action.singleCountry[0] };
    case SET_TRIP_INFO:
      return { ...state, tripInfo: action.tripInfo };
    case SET_SINGLE_CITY:
      return { ...state, singleCity: action.city };
    default:
      return state;
  }
};

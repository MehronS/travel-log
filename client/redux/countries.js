import axios from "axios";

// Action Types
const SET_ALL_COUNTRIES = `SET_ALL_COUNTRIES`;
const SET_SINGLE_COUNTRY = `SET_SINGLE_COUNTRY`;

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

const initialState = {
  countries: [],
  singleCountry: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_COUNTRIES:
      return { ...state, countries: action.countries };
    case SET_SINGLE_COUNTRY:
      return { ...state, singleCountry: action.singleCountry[0] };
    default:
      return state;
  }
};

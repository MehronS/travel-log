import axios from "axios";

// Action Types

const SET_SINGLE_USER = `SET_SINGLE_USER`;
const SET_USER_PICTURES = `SET_USER_PICTURES`;

// Action Creators
export const setSingleUser = (user) => {
  return {
    type: SET_SINGLE_USER,
    user,
  };
};

export const setUserPicturesAtLocation = (pictures) => {
  return {
    type: SET_USER_PICTURES,
    pictures,
  };
};

// Thunks

export const fetchSingleUser = (user) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/users/login`, user);
      const data = response.data;
      const token = response.headers[`authorization`];
      window.localStorage.setItem(`token`, token);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchSingleUserWithId = (id) => {
  const token = window.localStorage.getItem(`token`);
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`api/users/${id}`, {
        headers: {
          authorization: token,
        },
      });
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchCreatedUser = (user) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`api/users/`, user);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchUserPicturesAtLocation = (userId, locationName) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(
        `api/users/${userId}/pictures`,
        locationName
      );

      dispatch(setUserPicturesAtLocation(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateUserPicturesAtLocation = (userId, locationInfo) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        `api/users/${userId}/pictures`,
        locationInfo
      );
      dispatch(setUserPicturesAtLocation(data));
    } catch (error) {
      console.error(error);
    }
  };
};

const initialState = {
  singleUser: {},
  userPicturesAtLocation: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_USER:
      return { ...state, singleUser: action.user };
    case SET_USER_PICTURES:
      return { ...state, userPicturesAtLocation: [...action.pictures] };
    default:
      return state;
  }
};

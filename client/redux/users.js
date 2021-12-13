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
      const response = await axios.post(`api/users/create`, user);
      const data = response.data;
      const token = response.headers[`authorization`];
      window.localStorage.setItem(`token`, token);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchUserPicturesAtLocation = (userId, locationName) => {
  const token = window.localStorage.getItem(`token`);

  return async (dispatch) => {
    try {
      const { data } = await axios({
        url: `api/users/${userId}/pictures`,
        method: `put`,
        headers: { authorization: token },
        data: locationName,
      });

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

export const deleteUserPictureAtLocation = (imageId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/pictures/${imageId}`);
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeSingleCountryFromUser = (countryName, userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(
        `/api/countries/${countryName}/${userId}`
      );

      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const uploadUserPicturesAtLocation = (userId, locationName, files) => {
  // Have to create a FormData in order to send the images as the multipart/form-data encryption via axios.

  const fd = new FormData();

  fd.append("images", files);
  // for some reason, cant append an array of files once. Maybe cause its not an array but an object of objects. So.. use for in loop to keep appending single file to the same `images` key and the append will create an array itself
  for (let key in files) fd.append(`images`, files[key]);

  return async (dispatch) => {
    try {
      const { data } = await axios({
        data: fd,
        url: `/api/pictures/${locationName}/${userId}`,
        method: `POST`,
      });

      // console.log(`from thunk`, data);
      // dispatch(setUserPicturesAtLocation(data));
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

import axios from "axios";

// Action Types

const SET_SINGLE_USER = `SET_SINGLE_USER`;

// Action Creators
export const setSingleUser = (user) => {
  return {
    type: SET_SINGLE_USER,
    user,
  };
};

// Thunks

export const fetchSingleUser = (user) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`/api/users/login`, user);

      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchSingleUserWithId = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`api/users/login/${id}`);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

const initialState = {
  singleUser: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_USER:
      return { ...state, singleUser: action.user };
    default:
      return state;
  }
};

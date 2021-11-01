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
      console.log(`from thunk`, user);
      const data = await axios.get(`/api/users/login`, user);
      console.log(`response from thunk`, data);
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

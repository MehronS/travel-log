import { createStore, combineReducers, applyMiddleware } from "redux";
import countries from "./locations";
import users from "./users";
import thunkMiddleware from "redux-thunk";

const appReducer = combineReducers({ countries: countries, users: users });

const store = createStore(appReducer, applyMiddleware(thunkMiddleware));
export default store;

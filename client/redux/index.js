import { createStore, combineReducers, applyMiddleware } from "redux";
import countries from "./countries";
import thunkMiddleware from "redux-thunk";

// const appReducer = combineReducers({ countries: countries });

const store = createStore(countries, applyMiddleware(thunkMiddleware));
export default store;

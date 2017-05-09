import { combineReducers } from "redux"
import { routerReducer } from 'react-router-redux';

import agent from "./agentReducer";
import team from "./teamReducer";
import customers from "./customerReducer";

export default combineReducers({
  agent,
  team,
  customers,
  routing: routerReducer
})

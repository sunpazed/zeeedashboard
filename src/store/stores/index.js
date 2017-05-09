import { applyMiddleware, createStore, compose } from "redux";
import reducer from "~/store/reducers";

export default createStore(reducer)

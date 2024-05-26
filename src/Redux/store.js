import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { EcomReducer } from "./EcomReducer";
const store = createStore(EcomReducer, applyMiddleware(thunk));
export { store };

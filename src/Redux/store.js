// import { createStore, applyMiddleware } from "redux";
// import { thunk } from "redux-thunk";
// import { EcomReducer } from "./EcomReducer";
// const store = createStore(EcomReducer, applyMiddleware(thunk));
// export { store };
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { EcomReducer } from "./EcomReducer";

const store = createStore(
  EcomReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export { store };

import { combineReducers } from "redux";
import auth from "./auth";

const reducers = combineReducers({
  auth,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;

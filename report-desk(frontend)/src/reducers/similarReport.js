import { SET_SIMILAR_REPORTS } from "../constant/actionTypes";

const initialState = {
  similarReport: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SIMILAR_REPORTS:
      return { ...state, similarReport: action.payload };
    default:
      return { ...state };
  }
};

import { SET_CATEGORIES } from "../constant/actionTypes";

const initialState = {
    categoryList: [],
  };

  export default (state = initialState, action) => {
      switch (action.type) {
          case SET_CATEGORIES:
              return {
                  ...state,
                  categoryList:action.data
              }
      
          default:
              return {...state}
      }
  }

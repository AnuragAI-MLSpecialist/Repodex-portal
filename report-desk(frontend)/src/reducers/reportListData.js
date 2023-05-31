import {
  SET_MY_REPORT_LIST_DATA,
  SET_MORE_MY_REPORT_LIST_DATA,
  SET_CATEGORY_SUBCATEGORY_DATA,
  API_CALL_SUCCESS,
} from "../constant/actionTypes";

const initialState = {
  loading: false,
  reportList: [],
  categorySubCategoryData: [],
};

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_MY_REPORT_LIST_DATA:
      return {
        ...state,
        loading: false,
        reportList: {
          data: action.data,
          hasMore: action.data && action.data.length > 0,
        },
      };

    case SET_MORE_MY_REPORT_LIST_DATA:
      return {
        ...state,
        loading: true,
        reportList: {
          data: {
            ...action.data,
            docs: [...state.reportList.data.docs, ...action.data.docs],
          },
          hasMore: action.data && action.data.length > 0,
        },
      };

    case SET_CATEGORY_SUBCATEGORY_DATA:
      return {
        ...state,
        loading: false,
        categorySubCategoryData: {
          data: action?.payload,
        },
      };

    case API_CALL_SUCCESS:
      return {
        ...state,
      };

    default:
      return { ...state };
  }
};

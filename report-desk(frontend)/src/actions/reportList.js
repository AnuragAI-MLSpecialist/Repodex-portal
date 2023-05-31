import {
  SET_MY_REPORT_LIST_DATA,
  SET_MORE_MY_REPORT_LIST_DATA,
  API_CALL_SUCCESS,
  SET_CATEGORY_SUBCATEGORY_DATA,
  FETCH_DATA_API_CALL_INITIATED,
  API_CALL_ERROR,
  SET_CATEGORIES,
} from "../constant/actionTypes";
import { reportList } from "../Graphs/Auth/reportList";

export const setReportListData = (data) => {
  return {
    type: SET_MY_REPORT_LIST_DATA,
    data: data,
  };
};

/* nishit-dev start */
// export const setCategorySubcategoryData = (data) => {
//   return {
//     type: SET_CATEGORY_SUBCATEGORY_DATA,
//     payload: data,
//   };
// };
/* nishit-dev end */

export const setCategories = (data) =>{
  return {
    type :SET_CATEGORIES,
    data : data,
  }
}

export const setMoreReportList = (data) => {
  return {
    type: SET_MORE_MY_REPORT_LIST_DATA,
    payload: data,
  };
};

export const apiCallSuccess = (message) => {
  return {
    type: API_CALL_SUCCESS,
    payload: message,
  };
};

export const setApiError = (data) => {
  return {
    type: API_CALL_ERROR,
    payload: data,
  };
};

export const getMyReportList = (searchPaginationData, isMore) => {
  return (dispatch) => {
    reportList(searchPaginationData)
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: isMore
              ? SET_MORE_MY_REPORT_LIST_DATA
              : SET_MY_REPORT_LIST_DATA,
            data: response?.listReportData,
          });

          dispatch({
            type: API_CALL_SUCCESS,
            message: "My Group list data retrieved Successfully",
          });
        } else {
          dispatch({
            type: API_CALL_ERROR,
            message: "Please try again later",
          });
        }
      })

      .catch((err) => {
        console.log(err);
        dispatch({
          type: API_CALL_ERROR,
          message:
            "Unable to retrieve Report data, please try again after some time.",
        });
      });
  };
};

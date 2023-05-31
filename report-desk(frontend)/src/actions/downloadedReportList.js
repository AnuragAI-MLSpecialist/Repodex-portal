import {
  SET_USERS_DOWNLOADED_REPORT,
  SET_MORE_DOWNLOADED_REPORT_LIST_DATA,
  DOWNLOAD_API_SUCCESS,
  DOWNLOAD_API_ERROR,
  DOWNLOADED_REPORT_COUNT,
} from "../constant/actionTypes";
import {listDownloadedReport} from '../Graphs/Auth/downloadedReportApi';

export const setDownloadedReportList = (data) => {
    return {
      type: SET_USERS_DOWNLOADED_REPORT,
      data: data,
    };
  };

export const setMoreDownloadedReportList = (data) => {
    return {
      type: SET_MORE_DOWNLOADED_REPORT_LIST_DATA,
      payload: data,
    };
  };
  
  export const setDownloadApipiSuccess = (message) => {
    return {
      type: DOWNLOAD_API_SUCCESS,
      payload: message,
    };
  };
  
  export const setDownloadedApiError = (data) => {
    return {
      type: DOWNLOAD_API_ERROR,
      payload: data,
    };
  };

  export const setDownloadedReportCount = (count) => {
    return {
      type : DOWNLOADED_REPORT_COUNT,
      data : count,
    }
  }

  export const getUserDownloadedReportList = (searchPaginationData, isMore) => {
    return (dispatch) => {
        listDownloadedReport(searchPaginationData)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: isMore
                ? SET_MORE_DOWNLOADED_REPORT_LIST_DATA
                : SET_USERS_DOWNLOADED_REPORT,
              data: response?.data,
            });
  
            dispatch({
              type: DOWNLOAD_API_SUCCESS,
              message: "My Group list data retrieved Successfully",
            });

            dispatch({
              type:DOWNLOADED_REPORT_COUNT,
              data:response.data.totalDownloadCount,
            })
          } else {
            dispatch({
              type: DOWNLOAD_API_ERROR,
              message: "Please try again later",
            });
          }
        })
  
        .catch((err) => {
          console.log(err);
          dispatch({
            type: DOWNLOAD_API_ERROR,
            message:
              "Unable to retrieve Report data, please try again after some time.",
          });
        });
    };
  };
  

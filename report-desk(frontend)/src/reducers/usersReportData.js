import {
  SET_USERS_DOWNLOADED_REPORT,
  SET_MORE_DOWNLOADED_REPORT_LIST_DATA,
  DOWNLOAD_API_SUCCESS,
  DOWNLOADED_REPORT_COUNT,
} from "../constant/actionTypes";

const initialState = {
  isLoading: false,
  reportList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS_DOWNLOADED_REPORT:
      return {
        ...state,
        loading: false,
        reportList: {
          data: action.data,
          hasMore: action.data && action.data.length > 0,
        },
      };

    case SET_MORE_DOWNLOADED_REPORT_LIST_DATA:
      return {
        ...state,
        loading: true,
        reportList: {
          data: {
            list: {
              ...action.data.list.docs,
              docs: [
                ...state.reportList.data.list.docs,
                ...action.data.list.docs,
              ],
            },
          },
          hasMore: action.data && action.data.length > 0,
        },
      };

    case DOWNLOAD_API_SUCCESS:
      return {
        ...state,
      };

    case DOWNLOADED_REPORT_COUNT:
      return {
        ...state,
        downloadCount: action.data,
      };

    default:
      return { ...state };
  }
};

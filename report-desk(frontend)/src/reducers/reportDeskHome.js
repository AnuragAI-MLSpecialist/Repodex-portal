import {
  SET_REPORT_PDF,
  SET_REPORT_LIST,
  SET_BROWSE_DATA,
  SET_AUTOCOMPLETE_OPTIONS,
  SET_SEARCH_REPORT_LIST_DATA,
} from "../../src/constant/actionTypes";

const initialState = {
  reportPdf: [],
  reportList: [],
  browseData: [],
  autoCompleteOptions: [],
  homeReportListData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_REPORT_PDF:
      return { ...state, reportPdf: action.payload };

    case SET_REPORT_LIST:
      return { ...state, reportList: action.payload };

    case SET_BROWSE_DATA:
      return { ...state, browseData: action.payload };

    case SET_SEARCH_REPORT_LIST_DATA:
      return { ...state, homeReportListData: action.payload };

    case SET_AUTOCOMPLETE_OPTIONS:
      return { ...state, autoCompleteOptions: action.payload };

    default:
      return { ...state };
  }
};

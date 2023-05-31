import {
  SET_REPORT_PDF,
  SET_REPORT_LIST,
  SET_AUTOCOMPLETE_OPTIONS,
  SET_BROWSE_DATA,
  SET_SEARCH_REPORT_LIST_DATA,
} from "../../src/constant/actionTypes";

export const setAutocompleteOptions = (options) => {
  return {
    type: SET_AUTOCOMPLETE_OPTIONS,
    payload: options,
  };
};

export const setBrowseData = (data) => {
  return {
    type: SET_BROWSE_DATA,
    payload: data,
  };
};

export const setSearchReportListData = (data) => {
  return {
    type: SET_SEARCH_REPORT_LIST_DATA,
    payload: data,
  };
};

export const setReportPdfs = (pdfs) => {
  return {
    type: SET_REPORT_PDF,
    payload: pdfs,
  };
};

export const setReportList = (lists) => {
  return {
    type: SET_REPORT_LIST,
    payload: lists,
  };
};

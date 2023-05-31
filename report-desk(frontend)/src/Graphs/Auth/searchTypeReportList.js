import axios from "axios";
import { SEARCH_REPORT_LIST } from "../../constant/comman";

export const homeSearchReportList = async (pagination, value) => {
  try {
    return value
      ? await axios.get(
          `${SEARCH_REPORT_LIST}/${pagination.skip}/${pagination.limit}?search=name:${value}`
        )
      : await axios.get(
          `${SEARCH_REPORT_LIST}/${pagination.skip}/${pagination.limit}`
        );
  } catch (error) {
    throw error;
  }
};

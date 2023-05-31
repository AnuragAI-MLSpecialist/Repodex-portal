import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getHistoryList(skipNumber, limitNumber, searchText) {
  try {
    if (searchText) {
      return await axios.get(
        `${WEBURL}api/v1/auth/admin/search-history/list/${skipNumber}/${limitNumber}?search=name:${searchText}`
      );
    }

    return await axios.get(
      `${WEBURL}api/v1/auth/admin/search-history/list/${skipNumber}/${limitNumber}`
    );
  } catch (error) {
    throw error;
  }
}

import axios from "axios";
import {
  REPORTPDFLIST,
  VISITOR_COUNT,
  REPORTHOMELIST,
} from "../../constant/comman";

export async function reportPdfList() {
  try {
    return await axios.get(`${REPORTPDFLIST}`);
  } catch (error) {
    throw error;
  }
}

export async function reportHomeList() {
  try {
    return await axios.get(`${REPORTHOMELIST}`);
  } catch (error) {
    throw error;
  }
}

export async function visitorCount(userId) {
  try {
    if (userId) {
      return await axios.post(`${VISITOR_COUNT}`, { userId: userId });
    } else {
      return await axios.post(`${VISITOR_COUNT}`);
    }
  } catch (error) {
    throw error;
  }
}

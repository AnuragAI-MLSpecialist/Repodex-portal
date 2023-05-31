import { SEARCHHISTORY } from "../../constant/comman";
import axios from "axios";

export async function searchHistory(name) {
  try {
    if (name) {
      return await axios.post(`${SEARCHHISTORY}`, { text: name });
    }
  } catch (error) {
    throw error;
  }
}

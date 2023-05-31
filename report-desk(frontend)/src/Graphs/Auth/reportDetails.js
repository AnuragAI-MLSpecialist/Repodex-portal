import axios from "axios";
import { DOWNLOADREPORT, SIMILARREPORT } from "../../constant/comman";

export async function downloadReport(id) {
  try {
    return await axios.get(`${DOWNLOADREPORT}/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function similarReport(id) {
  try {
    return await axios.post(`${SIMILARREPORT}/0/10`, { report_id: id });
  } catch (error) {
    throw error;
  }
}

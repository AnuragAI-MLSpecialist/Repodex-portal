import axios from 'axios';
import { REPORTDETAILS } from "../../constant/comman";


export async function searchReport(reportId) {
    try {
      return await axios.get(`${REPORTDETAILS}/${reportId}`);
    } catch (error) {
      throw error;
    }
  }
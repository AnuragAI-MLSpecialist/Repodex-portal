import {VERIFYEMAIL} from '../../constant/comman';
import axios from 'axios';


export async function verifyEmail(id) {
    try {
      return await axios.post(`${VERIFYEMAIL}`, { userId: id });
    } catch (error) {
      throw error;
    }
  }
  
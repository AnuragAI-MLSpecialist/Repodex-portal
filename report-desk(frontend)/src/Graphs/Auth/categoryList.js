import axios from "axios";
import { CATEGORYLIST } from "../../constant/comman";

export const categoryList = async(pagination, value) => {
  try {
   
    return value
      ? await axios.get(
          `${CATEGORYLIST}/${pagination.skip}/${pagination.limit}?search=name:${value}`
        )
      : await axios.get(
          `${CATEGORYLIST}/${pagination.skip}/${pagination.limit}`
        );
  

    // return value.value
    //   ? await axios.get(
    //       `${CATEGORYLIST}/${value.skip}/${value.limit}?search=name:${value}`
    //     )
    //   : await axios.get(`${CATEGORYLIST}/${value.skip}/${value.limit}`);
  } catch (error) {
    throw error;
  }
}

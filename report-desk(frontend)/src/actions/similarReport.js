import { SET_SIMILAR_REPORTS } from "../constant/actionTypes";

export const setSimilarReport = (data) =>{
    return {
        type : SET_SIMILAR_REPORTS,
        payload : data,
    }
}
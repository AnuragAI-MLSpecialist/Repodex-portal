import { combineReducers } from 'redux';
import auth from './auth';
import reportDeskHome from './reportDeskHome';
import reportListData from './reportListData';
import similarReport from './similarReport';
import usersReportData from './usersReportData';
import categoryList from './categoryList';
import { USER_LOGOUT } from '../constant/actionTypes';

const reducers = combineReducers({
    auth,
    reportDeskHome,
    reportListData,
    similarReport,
    usersReportData,
    categoryList,
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined;
    }
  
    return reducers(state, action);
};

export default rootReducer;
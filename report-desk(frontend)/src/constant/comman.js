// export const WEBURL = "http://173.249.10.82:4034/";
// export const WEBURL = "https://api.thereportdesk.com/";
export const WEBURL = "http://localhost:4000";

const VERSION = "v1";

export const LOGIN = `${WEBURL}api/${VERSION}/user/login-user`;
export const SIGNUP = `${WEBURL}api/${VERSION}/user/sign-up`;
export const CATEGORYLIST = `${WEBURL}api/${VERSION}/user/home/category/top/list`;
export const VERIFYEMAIL = `${WEBURL}api/${VERSION}/user/verify-email`;
export const FORGOTPASSWORD = `${WEBURL}api/${VERSION}/user/forgot-password`;
export const REPORTPDFLIST = `${WEBURL}api/${VERSION}/user/report/pdf/home/list`;
export const REPORTHOMELIST = `${WEBURL}api/${VERSION}/user/report/all/home/list`;
export const VISITOR_COUNT = `${WEBURL}api/${VERSION}/user/visit-history/create`;
export const REPORTLIST = `${WEBURL}api/${VERSION}/user/report/list`;
export const DOWNLOADREPORT = `${WEBURL}api/${VERSION}/auth/user/report/download`;
export const SIMILARREPORT = `${WEBURL}api/${VERSION}/user/report/all/similar/list`;
export const USERPROFILE = `${WEBURL}api/${VERSION}/auth/user/profile`;
export const RESETPASSWORD = `${WEBURL}api/${VERSION}/auth/user/reset-password`;
export const DOWNLOADREPORTLIST = `${WEBURL}api/${VERSION}/auth/user/report/download/list`;
export const CUSTOMMAIL = `${WEBURL}api/${VERSION}/user/send-mail`;
export const FILTERCATEGORY = `${WEBURL}api/${VERSION}/user/sub-category/list/dropdown`;
export const SETNEWPASSWORD = `${WEBURL}api/${VERSION}/user/set-password`;
export const SEARCHHISTORY = `${WEBURL}api/${VERSION}/user/search-history/create`;
export const REPORTDETAILS = `${WEBURL}api/${VERSION}/user/report`;
export const SEARCH_REPORT_LIST = `${WEBURL}api/${VERSION}/user/home/report/top/list`;

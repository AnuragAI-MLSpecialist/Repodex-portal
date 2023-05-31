import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { callLogin } from "../../Graphs/Auth/login";
import * as moment from "moment";
import CustomLoader from "../../components/Common/CustomLoader";
import { getDashboardData,getGptInfo,getGptUsers,allQuestions,users } from "../../Graphs/Dashboard/dashboard";
import { getUsersList } from "../../Graphs/User/user";
import { notification, Popconfirm, Spin, Table, Tooltip } from "antd";


import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dashboardData: null,
      userData:[],
      userDataTotal:0,
      isLoading:false,
      searchText: "",
      pagination: {
        pageSize: 10,
        current: 1,
      },
      startIndex: 0,
      limitNumber: 10,
    };
  }

  componentDidMount = async () => {
    try {
      const { data } = await getDashboardData();
      //map question asked and got answer with user
      
      // console.log(data)
      const response1= await getGptUsers()
     
      this.setState({
        dashboardData: data,
        userData:response1?.data
        
      });
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

   
  counter = 0;
  tempCounter = 0;
  columns = [
    {
      title: "Sr. No.",
      key: "serial_number",
      fixed: window.innerWidth < 768 ? false : true,
      width: 80,
      render: (text, item, index) => {
        return (
          <div>
            <span>{++index + this.tempCounter}</span>
          </div>
        );
      },
    },
    {
      title: "Name",
      key: "Name",
      render: (text, item, index) => {
        return <div>{item[1] ? item[1] : "-"}</div>;
      },
    },
    {
      title: "Email",
      key: "Email",
      render: (text, item, index) => {
        return <div>{item[2] ? item[2] : "-"}</div>;
      },
    },
    {
      title: "Phone",
      key: "Phone",
      render: (text, item, index) => {
        return <div>{item[3] ? item[3] : "-"}</div>;
      },
    },
    {
      title: "Company Name",
      key: "Company Name",
      render: (text, item, index) => {
        return <div>{item[4] ? item[4] : "-"}</div>;
      },
    },
   
    
    // {
    //   title: "Action",
    //   key: "Action",
    //   render: (text, item, index) => {
    //     return (
    //       <div>
    //         {item.is_active ? (
    //           <Tooltip title={"Deactivate"}>
    //             <div
    //               style={{
    //                 float: "left",
    //                 cursor: "pointer",
    //                 marginRight: "5px",
    //               }}
    //               onClick={() => this.changeStatus(item._id, false)}
    //             >
    //               <i class="fas fa-ban text-warning"></i>
    //             </div>
    //           </Tooltip>
    //         ) : (
    //           <Tooltip title={"Activate"}>
    //             <div
    //               style={{
    //                 float: "left",
    //                 cursor: "pointer",
    //                 marginRight: "5px",
    //               }}
    //               onClick={() => this.changeStatus(item._id, true)}
    //             >
    //               <i class="far fa-check-circle text-primary"></i>
    //             </div>
    //           </Tooltip>
    //         )}

    //         <Tooltip title={"Delete"}>
    //           <Popconfirm
    //             onConfirm={() => {
    //               this.deleteUser(item._id);
    //             }}
    //             title="Are you sure you want to delete this user?"
    //           >
    //             <div
    //               style={{
    //                 float: "left",
    //                 cursor: "pointer",
    //                 marginRight: "5px",
    //               }}
    //             >
    //               <i class="fa-regular fa-trash-can text-danger"></i>
    //             </div>
    //           </Popconfirm>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];

  onSearchChange = (e) => {
    this.setState(
      {
        searchText: e.target.value,
      },
      () => {
        this.getListUserData(this.state.pagination);
      }
    );
  };
  handleTableChange = (pagination, filters) => {
    this.setState(
      {
        pagination,
      },
      () => this.getListUserData(pagination)
    );
  };

  getListUserData = async (pagination) => {
    const { searchText } = this.state;
    const start =
      pagination.current * pagination.pageSize - pagination.pageSize;
    const end = pagination.pageSize;

    this.setState(
      {
        isLoading: true,
        startIndex: start,
        limitNumber: end,
      },
      async () => {
        if (searchText && searchText !== "") {
          this.listSearchUserData(start, end);
        } else {
          this.listUserData(start, end);
        }
      }
    );
  };

  listUserData = async (start, end) => {
    try {
      this.setState({
        isLoading: true,
      });
      const {
        userData: { docs, totalDocs },
      } = await getUsersList(start, end);
      this.setState({
        userData: docs,
        userDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  listSearchUserData = async (start, end) => {
    try {
      const { searchText } = this.state;
      this.setState({
        isLoading: true,
      });
      const {
        userData: { docs, totalDocs },
      } = await getUsersList(start, end, searchText);
      this.setState({
        userData: docs,
        userDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };


  render() {
    console.log(this.state.userData,"asdfsf")
    const { isLoading, dashboardData,userData,userDataTotal } = this.state;

    return isLoading ? (
      <CustomLoader />
    ) : (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="col-md-12 order-1">
              <div className="row dashboard-row">
                <div className="col-lg-3 col-md-12 col-6 mb-4">
                  <div className="card h-100">
                    <Link to={"/users"}>
                      <div className="card-body">
                        <div className="card-title d-flex align-items-center justify-content-between">
                          <div className="avatar flex-shrink-0 bg-label-primary p-2">
                            <i className="far fa-user-circle menu-icon" />
                          </div>
                        </div>
                        <span className="dashboard-text">Registered Users</span>
                        <h3 className="card-title mb-2">
                          {dashboardData
                            ? dashboardData.registeredUsersCount
                            : 0}
                        </h3>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-6 mb-4">
                  <div className="card h-100">
                    <Link to={"/reports"}>
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0 bg-label-primary p-2">
                            <i className="fa-regular fa-file menu-icon" />
                          </div>
                        </div>
                        <span className="dashboard-text">Total Reports</span>
                        <h3 className="card-title text-nowrap mb-1">
                          {dashboardData ? dashboardData.reportCount : 0}
                        </h3>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title d-flex align-items-start justify-content-between">
                        <div className="avatar flex-shrink-0 bg-label-primary p-2">
                          <i className="fa-regular fa-eye menu-icon" />
                        </div>
                      </div>
                      <span className="d-block mb-1 dashboard-text">
                        Total Visits
                      </span>
                      <h3 className="card-title text-nowrap mb-2">
                        {dashboardData ? dashboardData.viewCount : 0}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title d-flex align-items-start justify-content-between">
                        <div className="avatar flex-shrink-0 bg-label-primary p-2">
                          <i className="far fa-arrow-alt-circle-down menu-icon" />
                        </div>
                      </div>
                      <span className="dashboard-text">Total Downloads</span>
                      <h3 className="card-title mb-2">
                        {dashboardData ? dashboardData.downloadCount : 0}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-backdrop fade" />



        <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Basic Bootstrap Table */}
          <div className="card py-3">
            <div className="col-md-5 col-12 pb-3">
              <div className="row">
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="basic-default-name"
                    placeholder="Search User"
                    value={this.state.searchText}
                    onChange={(event) => this.onSearchChange(event)}
                    required={true}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              {isLoading ? (
                <div
                  style={{
                    display: "inline-block",
                    width: "100%",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <Table
                  loading={isLoading}
                  columns={this.columns}
                  rowKey={(record) => record._id}
                  size={"small"}
                  dataSource={userData}
                  // pagination={{
                  //   total: this.state.userDataTotal,
                  //   showSizeChanger: true,
                  //   pageSize: this.state.pagination.pageSize,
                  //   current: this.state.pagination.current,
                  //   pageSizeOptions: ["1", "10", "25", "50", "100"],
                  //   onChange: (e) => {
                  //     {
                  //       if (e - 1) {
                  //         this.counter = this.tempCounter =
                  //           (e - 1) * this.state.pagination.pageSize;
                  //         return;
                  //       }
                  //       this.counter = 0;
                  //       this.tempCounter = 0;
                  //     }
                  //   },
                  // }}
                  // onChange={this.handleTableChange}
                />
              )}
            </div>
          </div>
          {/* / Content */}
          <div className="content-backdrop fade" />
        </div>
      </div>
    

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginFlag: state.auth.loginFlag,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginFlag: (flag) => {
      dispatch({
        type: "SET_LOGIN_FLAG",
        flag: flag,
      });
    },
    setUserData: (userData) => {
      dispatch({
        type: "SET_USER_DATA",
        userData: userData,
      });
    },
    setUserToken: (authToken) => {
      dispatch({
        type: "SET_USER_AUTHTOKEN",
        authToken: authToken,
      });
    },
  };
};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));

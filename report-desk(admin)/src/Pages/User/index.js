import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { notification, Popconfirm, Spin, Table, Tooltip } from "antd";
// import * as moment from "moment";
import CustomLoader from "../../components/Common/CustomLoader";
import {
  changeActiveStatus,
  deleteUser,
  getUsersList,
} from "../../Graphs/User/user";
import moment from "moment";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dashboardData: null,
      userData: [],
      userDataTotal: 0,
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
      await this.listUserData(0, 10);
    } catch (e) {}
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
      title: "Email",
      key: "Email",
      render: (text, item, index) => {
        return <div>{item.email ? item.email : "-"}</div>;
      },
    },
    {
      title: "Phone",
      key: "Phone",
      render: (text, item, index) => {
        return <div>{item.phone ? item.phone : "-"}</div>;
      },
    },
    {
      title: "Company Name",
      key: "Company Name",
      render: (text, item, index) => {
        return <div>{item.company_name ? item.company_name : "-"}</div>;
      },
    },
    {
      title: "Country",
      key: "Country",
      render: (text, item, index) => {
        return <div>{item.country ? item.country : "-"}</div>;
      },
    },
    {
      title: "REG. Date",
      key: "Registration Date",
      render: (text, item, index) => {
        return (
          <div>
            {item.createdAt ? moment(item.createdAt).format("LL") : "-"}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "Status",
      render: (text, item, index) => {
        return (
          <div>
            {item.is_active ? (
              <span class="badge bg-label-primary me-1">Active</span>
            ) : (
              <span class="badge bg-label-danger me-1">Deactivate</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (text, item, index) => {
        return (
          <div>
            {item.is_active ? (
              <Tooltip title={"Deactivate"}>
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => this.changeStatus(item._id, false)}
                >
                  <i class="fas fa-ban text-warning"></i>
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={"Activate"}>
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => this.changeStatus(item._id, true)}
                >
                  <i class="far fa-check-circle text-primary"></i>
                </div>
              </Tooltip>
            )}

            <Tooltip title={"Delete"}>
              <Popconfirm
                onConfirm={() => {
                  this.deleteUser(item._id);
                }}
                title="Are you sure you want to delete this user?"
              >
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  <i class="fa-regular fa-trash-can text-danger"></i>
                </div>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

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

  changeStatus = async (userId, status) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await changeActiveStatus(userId, status);
      notification["success"]({
        message: "User",
        description: "User status changed successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchUserData(startIndex, limitNumber);
      } else {
        this.listUserData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  deleteUser = async (userId) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await deleteUser(userId);
      notification["success"]({
        message: "User",
        description: "User deleted successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchUserData(startIndex, limitNumber);
      } else {
        this.listUserData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

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

  render() {
    const { isLoading, userData, userDataTotal } = this.state;

    return (
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
                  pagination={{
                    total: userDataTotal,
                    showSizeChanger: true,
                    pageSize: this.state.pagination.pageSize,
                    current: this.state.pagination.current,
                    pageSizeOptions: ["1", "10", "25", "50", "100"],
                    onChange: (e) => {
                      {
                        if (e - 1) {
                          this.counter = this.tempCounter =
                            (e - 1) * this.state.pagination.pageSize;
                          return;
                        }
                        this.counter = 0;
                        this.tempCounter = 0;
                      }
                    },
                  }}
                  onChange={this.handleTableChange}
                />
              )}
            </div>
          </div>
          {/* / Content */}
          <div className="content-backdrop fade" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginFlag: state.auth.loginFlag,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserList));

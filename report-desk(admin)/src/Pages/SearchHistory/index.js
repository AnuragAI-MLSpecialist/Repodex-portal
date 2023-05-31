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
import { getHistoryList } from "../../Graphs/SearchHistory/history";

class SearchHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      historyData: [],
      historyDataTotal: 0,
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
      await this.listHistoryData(0, 10);
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
      title: "Search",
      key: "Search",
      render: (text, item, index) => {
        return <div>{item.text ? item.text : "-"}</div>;
      },
    },
    {
      title: "User Name",
      key: "user_name",
      render: (text, item, index) => {
        return (
          <div>
            {item.user_id
              ? item.user_id.first_name
                ? item.user_id.last_name
                  ? `${item.user_id.first_name} ${item.user_id.last_name}`
                  : item.user_id.first_name
                : "-"
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Date",
      key: "Search Date",
      render: (text, item, index) => {
        return (
          <div>
            {item.createdAt ? moment(item.createdAt).format("DD/MM/YY") : "-"}
          </div>
        );
      },
    },
    {
      title: "Time",
      key: "Search Date",
      render: (text, item, index) => {
        return (
          <div>
            {item.createdAt ? moment(item.createdAt).format("hh:mm:ss") : "-"}
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
      () => this.getListHistoryData(pagination)
    );
  };

  getListHistoryData = async (pagination) => {
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
          this.listSearchHistoryData(start, end);
        } else {
          this.listHistoryData(start, end);
        }
      }
    );
  };

  listHistoryData = async (start, end) => {
    try {
      this.setState({
        isLoading: true,
      });
      const {
        searchHistoryList: { docs, totalDocs },
      } = await getHistoryList(start, end);
      this.setState({
        historyData: docs,
        historyDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  listSearchHistoryData = async (start, end) => {
    try {
      const { searchText } = this.state;
      this.setState({
        isLoading: true,
      });
      const {
        searchHistoryList: { docs, totalDocs },
      } = await getHistoryList(start, end, searchText);
      this.setState({
        historyData: docs,
        historyDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
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
        this.getListHistoryData(this.state.pagination);
      }
    );
  };

  render() {
    const { isLoading, historyData, historyDataTotal } = this.state;

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
                    placeholder="Search text"
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
                  dataSource={historyData}
                  pagination={{
                    total: historyDataTotal,
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
)(withRouter(SearchHistoryList));

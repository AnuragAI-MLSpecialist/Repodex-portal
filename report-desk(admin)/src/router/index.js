/* eslint-disable */

import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "../components/app";
import { connect } from "react-redux";
import { AuthRouteGaurd } from "./AuthRouteGuard";
import { UnAuthRouteGaurd } from "./UnAuthRouteGuard";
import Login from "../Pages/Login/index";
import Dashboard from "../Pages/Dashboard";
import UserList from "../Pages/User";
import SearchHistoryList from "../Pages/SearchHistory";
import CategoryList from "../Pages/Category";
import SubCategoryList from "../Pages/SubCategory";
import ReportList from "../Pages/Report";
import CreateReport from "../Pages/Report/createReport";
import ChangePassword from "../Pages/ChangePassword";
import TrainModel from "../Pages/TrainModel";

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { loginFlag } = this.props;

    return (
      <Switch>
        <UnAuthRouteGaurd
          exact
          path={`${process.env.PUBLIC_URL}/`}
          component={Login}
        />
        <UnAuthRouteGaurd
          exact
          path={`${process.env.PUBLIC_URL}/login`}
          component={Login}
        />
        <Fragment>
          <App>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/dashboard`}
              component={Dashboard}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/change-password`}
              component={ChangePassword}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/users`}
              component={UserList}
            />
             <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/train-model`}
              component={TrainModel}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/search-history`}
              component={SearchHistoryList}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/categories`}
              component={CategoryList}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/sub-categories`}
              component={SubCategoryList}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/reports`}
              component={ReportList}
            />
            <AuthRouteGaurd
              exact
              path={`${process.env.PUBLIC_URL}/create-reports`}
              component={CreateReport}
            />
          </App>
        </Fragment>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({
  loginFlag: state.auth.loginFlag,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);

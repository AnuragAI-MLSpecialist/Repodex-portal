/* eslint-disable */

import React, { Component, Fragment, lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import App from "../components/app";

import { connect } from "react-redux";
import logo_tr from "../assets/images/logo_tr3.png";
import { AuthRouteGaurd } from "./AuthRouteGuard";
import { UnAuthRouteGaurd } from "./UnAuthRouteGuard";

// const Login = lazy(() => import("../Pages/Login/index"));
const Home = lazy(() => import("../Pages/index"));
const AboutUs = lazy(() => import("../Pages/AboutUs"));
const ChatGPT = lazy(() => import("../Pages/ChatGPT"));
const Reports = lazy(() => import("../Pages/Reports"));
const ContactUs = lazy(() => import("../Pages/ContactUs"));
const Disclaimer = lazy(() => import("../Pages/Disclaimer"));
const DontPublishReport = lazy(() => import("../Pages/Don'tPublishMyReport"));
const TermsAndConditions = lazy(() => import("../Pages/TermsAndConditions"));
const MyProfile = lazy(() => import("../Pages/MyProfile"));
const MyDownloads = lazy(() => import("../Pages/MyDownloads"));
const ReportDetails = lazy(() => import("../Pages/ReportDetails"));
const ForgotPassword = lazy(() => import("../components/forgotPassword"));
const VerifyEmail = lazy(() => import("../Pages/VerifyEmail"));
const NewPassword = lazy(() => import("../components/newPassword"));
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy"));
const TrainModel = lazy(() => import("../Pages/TrainModel"));

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { loginFlag } = this.props;
    return (
      <Switch>
        <Suspense
          fallback={
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "100vh" }}
            >
              <img src={logo_tr} alt="Reportdesk logo" height="100" />
              <span
                className="pt-4 text-secondary"
                style={{ fontSize: "14px" }}
              >
                Loading...
              </span>
            </div>
          }
        >
          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/`}
            component={Home}
          />
          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/dashboard`}
            component={Home}
          />
          {/* <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/login`}
            component={Login}
          /> */}

          {!loginFlag && (
            <>
              <UnAuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/reports`}
                component={Reports}
              />
              
              <UnAuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/report-details/:id`}
                component={ReportDetails}
              />
              {/* <UnAuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/about-us`}
                component={AboutUs}
              /> */}
            </>
          )}

          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/disclaimer`}
            component={Disclaimer}
          />
          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/dont-publish-my-report`}
            component={DontPublishReport}
          />
          {/* <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/terms-and-conditions`}
            component={TermsAndConditions}
          /> */}

          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/forgot-password`}
            component={ForgotPassword}
          />
          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/verify-email/:id`}
            component={VerifyEmail}
          />

          <UnAuthRouteGaurd
            exact
            path={`${process.env.PUBLIC_URL}/reset-password/:code`}
            component={NewPassword}
          />

          <Fragment>
            <App>
              <AuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/dashboard`}
                component={Home}
              />
              <AuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/my-profile`}
                component={MyProfile}
              />
              <AuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/my-downloads`}
                component={MyDownloads}
              />

              {/* <AuthRouteGaurd
                exact
                path={`${process.env.PUBLIC_URL}/about-us`}
                component={AboutUs}
              /> */}

              {loginFlag && (
                <>
                  <AuthRouteGaurd
                    exact
                    path={`${process.env.PUBLIC_URL}/reports`}
                    component={Reports}
                  />
                  <AuthRouteGaurd
                    exact
                    path={`${process.env.PUBLIC_URL}/report-details/:id`}
                    component={ReportDetails}
                  />
                  {/* <AuthRouteGaurd
                    exact
                    path={`${process.env.PUBLIC_URL}/terms-and-conditions`}
                    component={TermsAndConditions}
                  /> */}

                  {/* <AuthRouteGaurd
                    exact
                    path={`${process.env.PUBLIC_URL}/contact-us`}
                    component={ContactUs}
                  /> */}
                </>
              )}
            </App>
          </Fragment>

          <Route
            exact
            path={`${process.env.PUBLIC_URL}/contact-us`}
            component={ContactUs}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/train_model`}
            component={TrainModel}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/about-us`}
            component={AboutUs}
          />
         
          <Route
            path={`${process.env.PUBLIC_URL}/terms-and-conditions`}
            component={TermsAndConditions}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/privacy-policy`}
            component={PrivacyPolicy}
          />
        </Suspense>
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

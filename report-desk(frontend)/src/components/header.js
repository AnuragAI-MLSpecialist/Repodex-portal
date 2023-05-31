import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Space } from "antd";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import logo_tr from "../assets/images/logo_tr3.png";

import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./forgotPassword";
import Otp from "./otp";
import { logout } from "../actions/auth";

const Header = () => {
  const dispatch = useDispatch();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [forgotPwdModalVisible, setForgotPwdModalVisible] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const auth = useSelector((state) => state.auth);

  const addSubmit = async (values) => {
    const {
      authToken,
      history,
      setLoginFlag,
      setUserData,
      setUserToken,
      setListAdminData,
      setListAdminDataTotal,
    } = this.props;

    try {
      let userData = await userData(authToken, values);

      if (userData.status === 200) {
        notification["success"]({
          message: "New User Added Successfully",
        });
      } else if (userData.status === 401) {
        await setLoginFlag(false);
        await setUserData(null);
        await setUserToken(null);
        history.push(`${process.env.PUBLIC_URL}/login`);
      }
    } catch (e) {
      notification["success"]({
        message: "There was a problem in Adding User",
      });
      console.log("!!!!!!!!e", e);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="my-profile">
        <Link to="/my-profile">
          <svg
            class="me-2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-user"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          &nbsp;My Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="my-downloads">
        <Link to="/my-downloads">
          <svg
            class="me-2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-download"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          &nbsp;My Downloads
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link onClick={() => dispatch(logout())} to="/dashboard">
          <svg
            class="me-2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          &nbsp;Logout
        </Link>
      </Menu.Item>
    </Menu>
  );

  const handleOpenModal = (props) => {
    console.log(props);
  };

  const handleSignupModal = () => {
    setShowSignupModal(true);
    setLoginModalVisible(false);
  };

  const handleLoginModal = () => {
    setLoginModalVisible(true);
    setShowSignupModal(false);
  };

  const handleForgotPasswordModal = () => {
    setLoginModalVisible(false);
    setForgotPwdModalVisible(true);
  };

  const handleOtpModalVisible = () => {
    setShowSignupModal(false);
    setOtpModalVisible(true);
  };

  return (
    <header className="header sticky-top">
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo_tr} alt="Reportdesk logo" width="100" height="80" />
          </Link>

          <div className="login_btns text-end order-lg-2 me-0 ms-auto">
            {!auth.loginFlag ? (
              <>
                <a
                  href="javascript:void(0)"
                  data-bs-toggle="modal"
                  data-bs-target="#SignupModal"
                >
                  <span onClick={handleSignupModal}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-user-plus"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    SIGNUP
                  </span>
                </a>
                {showSignupModal && (
                  <Signup
                    onSubmit={addSubmit}
                    showSignupModal={showSignupModal}
                    setShowSignupModal={setShowSignupModal}
                    handleOtpModalVisible={handleOtpModalVisible}
                  />
                )}
                {otpModalVisible && (
                  <Otp
                    otpModalVisible={otpModalVisible}
                    setOtpModalVisible={setOtpModalVisible}
                  />
                )}
                <a
                  href="javascript:void(0)"
                  data-bs-toggle="modal"
                  data-bs-target="#LoginModal"
                >
                  <span onClick={handleLoginModal}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-log-in"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    LOGIN
                  </span>
                </a>

                {loginModalVisible && (
                  <Login
                    onSubmit={handleOpenModal}
                    loginModalVisible={loginModalVisible}
                    setLoginModalVisible={setLoginModalVisible}
                    handleForgotPasswordModal={handleForgotPasswordModal}
                    handleSignupModal={handleSignupModal}
                  />
                )}
                {forgotPwdModalVisible && (
                  <ForgotPassword
                    forgotPwdModalVisible={forgotPwdModalVisible}
                    setForgotPwdModalVisible={setForgotPwdModalVisible}
                  />
                )}
              </>
            ) : (
              <>
                <div className=" btn-group float-end ">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="d-flex text-nowrap align-items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-user"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {auth?.loginUserData?.first_name || ""}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </>
            )}
          </div>
          <button
            className="custom-toggler navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <div
            className="collapse navbar-collapse order-lg-1"
            id="navbarTogglerDemo02"
          >
            <div className="navbar-nav mx-auto mb-2 mb-lg-0">
             <a className="nav-item">
                <Link to="/train_model" className="nav-link px-3">
                  Train Model
                </Link>
              </a>
              <a className="nav-item">
                <Link to="/about-us" className="nav-link px-3">
                  About Us
                </Link>
              </a>
              <a className="nav-item">
                <Link to="/reports" className="nav-link px-3">
                  Reports
                </Link>
              </a>
              <a className="nav-item">
                <Link to="/contact-us" className="nav-link px-3">
                  Contact Us
                </Link>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { callLogin } from "../../Graphs/Auth/login";
import { notification } from "antd";
// import * as moment from "moment";
import logo_tr from "../../assets/images/logo_tr_1.png";
import CustomLoader from "../../components/Common/CustomLoader";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fields: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
    };
  }

  loginSubmit = async () => {
    try {
      const { fields, errors } = this.state;
      const { setUserToken, setUserData, setLoginFlag, history } = this.props;
      const listError = { ...errors };

      if (!fields["email"]) {
        listError["email"] = "Email is required";
        this.setState({
          errors: listError,
        });

        return;
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!emailRegex.test(fields["email"])) {
        listError["email"] = "Please enter valid email";
        this.setState({
          errors: listError,
        });

        return;
      }

      listError["email"] = "";
      this.setState({
        errors: listError,
      });

      if (!fields["password"]) {
        listError["password"] = "Password is required";
        this.setState({
          errors: listError,
        });

        return;
      }

      listError["password"] = "";
      this.setState({
        errors: listError,
      });

      this.setState({
        isLoading: true,
      });

      const { data } = await callLogin(fields["email"], fields["password"]);

      notification["success"]({
        message: "Login",
        description: "Login Successfully",
      });

      await setUserToken(data.authToken);
      await setUserData(data);
      await setLoginFlag(true);

      history.push(`${process.env.PUBLIC_URL}/dashboard`);
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  // onChange of text input
  onChange = (text, name) => {
    const { fields } = this.state;
    let subFields = { ...fields };
    subFields[name] = text.target.value;
    this.setState({
      fields: subFields,
    });
  };

  render() {
    const { errors, isLoading } = this.state;

    return isLoading ? (
      <CustomLoader />
    ) : (
      <div className="container-xxl">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            {/* Register */}
            <div className="card">
              <div className="card-body">
                {/* Logo */}
                <div className="app-brand justify-content-center">
                  <div className="app-brand-link gap-2">
                    <span className="app-brand-logo demo">
                      <img
                        src={logo_tr}
                        alt="logo"
                        className="img-fluid"
                        width={150}
                        height
                      />
                    </span>
                  </div>
                </div>
                {/* /Logo */}
                <h4 className="mb-3 text-center">Welcome to ReportDesk!</h4>
                <form
                  id="formAuthentication"
                  className="mb-3"
                  action="index.html"
                  method="POST"
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Id
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email-username"
                      placeholder="Enter your email id"
                      autofocus
                      onChange={(text) => this.onChange(text, "email")}
                    />
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "red" }}
                    >
                      {errors.email ? errors.email : ""}
                    </label>
                  </div>
                  <div className="mb-3 form-password-toggle">
                    <div className="d-flex justify-content-between">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <div className="input-group input-group-merge">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        placeholder="············"
                        aria-describedby="password"
                        onChange={(text) => this.onChange(text, "password")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            this.loginSubmit();
                          }
                        }}
                      />
                      <span className="input-group-text cursor-pointer">
                        <i className="bx bx-hide" />
                      </span>
                    </div>
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "red" }}
                    >
                      {errors.password ? errors.password : ""}
                    </label>
                  </div>
                  <div className="mb-3">
                    <a
                      href="javascript::void(0)"
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      onClick={this.loginSubmit}
                    >
                      Login
                    </a>
                  </div>
                </form>
              </div>
            </div>
            {/* /Register */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

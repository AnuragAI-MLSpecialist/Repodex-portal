import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { changePassword } from "../../Graphs/Auth/login";
import { notification } from "antd";
import CustomLoader from "../../components/Common/CustomLoader";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fields: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      errors: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  }

  changePasswordSubmit = async () => {
    try {
      const { fields, errors } = this.state;
      const listError = { ...errors };
      const { history } = this.props;

      if (!fields["currentPassword"]) {
        listError["currentPassword"] = "Current Password is required";
        this.setState({
          errors: listError,
        });

        return;
      }

      listError["currentPassword"] = "";
      this.setState({
        errors: listError,
      });

      if (!fields["newPassword"]) {
        listError["newPassword"] = "New Password is required";
        this.setState({
          errors: listError,
        });

        return;
      }

      listError["newPassword"] = "";
      this.setState({
        errors: listError,
      });

      if (!fields["confirmPassword"]) {
        listError["confirmPassword"] = "Confirm Password is required";
        this.setState({
          errors: listError,
        });

        return;
      }

      listError["confirmPassword"] = "";
      this.setState({
        errors: listError,
      });

      if (fields["newPassword"] !== fields["confirmPassword"]) {
        notification["error"]({
          message: "Change Password",
          description: "Confirm password does not match",
        });

        return;
      }

      this.setState({
        isLoading: true,
      });

      await changePassword(fields["currentPassword"], fields["newPassword"]);

      notification["success"]({
        message: "Change Password",
        description: "Password Changed Successfully",
      });

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
    console.log("!!!errors!!!", errors);

    return isLoading ? (
      <CustomLoader />
    ) : (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row justify-content-center">
            <div className="col col-md-8 col-12">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Current Password
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="*********"
                        onChange={(text) =>
                          this.onChange(text, "currentPassword")
                        }
                      />
                    </div>
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "red", marginTop: "5px" }}
                    >
                      {errors.currentPassword ? errors.currentPassword : ""}
                    </label>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      New Password
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="*********"
                        onChange={(text) => this.onChange(text, "newPassword")}
                      />
                    </div>
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "red", marginTop: "5px" }}
                    >
                      {errors.newPassword ? errors.newPassword : ""}
                    </label>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Re-enter Password
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="*********"
                        onChange={(text) =>
                          this.onChange(text, "confirmPassword")
                        }
                      />
                    </div>
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "red", marginTop: "5px" }}
                    >
                      {errors.confirmPassword ? errors.confirmPassword : ""}
                    </label>
                  </div>
                  <div className="row justify-content-end">
                    <div className="col-sm-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => this.changePasswordSubmit()}
                      >
                        <i className="far fa-check-circle me-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* / Content */}
        <div className="content-backdrop fade" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChangePassword));

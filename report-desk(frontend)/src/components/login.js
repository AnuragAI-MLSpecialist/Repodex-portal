import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Input, Modal } from "antd";
import { notification } from "antd";
import { callLogin } from "../Graphs/Auth/login";
import { useHistory } from "react-router-dom";
import Signup from "./signup";
import {
  setLoginFlag,
  setLoginUserData,
  setAuthToken,
  setRouteName,
} from "../actions/auth";

const Login = ({
  loginModalVisible,
  setLoginModalVisible,
  handleForgotPasswordModal,
  handleSignupModal,
}) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [err, setErr] = useState("");
  const validateForm = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Username is required";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password !== "" && values.password.length < 8) {
      errors.password = "At least 8 characters required";
    }

    console.log("Validating errors -- ", errors);

    return errors;
  };

  const handleError = (error) => {
    setErr(error);
  };

  const doLogin = async (values) => {
    await callLogin(values.email, values.password)
      .then((res) => {
        if (res.status === 200) {
          notification["success"]({
            message: "Logged In Successfully",
          });
          dispatch(setLoginFlag(true));
          dispatch(setLoginUserData(res.data));
          dispatch(setAuthToken(res.data.authToken));
          dispatch(setRouteName("/Dashboard"));
          history.go("/");
        } else if (res.status === 500) {
          console.log(res);
          handleError(res.message);
        }
      })
      .catch((err) => {
        console.log("Error in Login --", err);
        handleError(err.message);
        return err;
      });
  };

  const handleSubmit = async (values, action) => {
    validateForm(values);
    doLogin(values);
  };

  return (
    <div>
      <Modal
        destroyOnClose={true}
        visible={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => {
            return (
              <div>
                <div class="modal_heading text-center mb-3">
                  <h4 class="modal-title mb-1" id="exampleModalLabel">
                    Log in to <span>your account</span>
                  </h4>
                </div>
                <div className="formik-field_wrap row auth_form">
                  <div className="formik-field-left col col-12 auth_field">
                    Username
                    <Input
                      style={{ padding: "10px 15px" }}
                      id="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="formik-field_wrap row auth_form">
                  <div className="formik-field-left col col-12 auth_field">
                    Password
                    <Input
                      style={{ padding: "10px 15px" }}
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.password}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col col-6 mb-3 pr-0">
                    <div className="form-check">
                      <Input
                        // style={{ padding: "10px 15px", width: "20px" }}
                        type="checkbox"
                        id="rememberMe"
                        value={values.rememberMe}
                        className="form-check-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.rememberMe && touched.rememberMe ? (
                        <p
                          style={{
                            color: "red",
                            fontSize: "small",
                            margin: "0",
                          }}
                        >
                          {errors.rememberMe}
                        </p>
                      ) : null}
                      <label className="form-check-label" for="exampleCheck1">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <div className="col col-6 mb-3 text-end">
                    <label onClick={() => handleForgotPasswordModal()}>
                      <a
                        href="javascript:void(0)"
                        data-bs-toggle="modal"
                        data-bs-target="#ForgotPassModal"
                      >
                        Forgot Password?
                      </a>
                    </label>
                    {/* <Modal
                    destroyOnClose={true}
                    visible={open}
                    onCancel={() => setOpen(false)}
                    footer={null}
                  > 
                    <ForgotPassword
                      isVisible={visible}
                      setVisible={setVisible}
                    />
                    </Modal> */}
                  </div>
                </div>
                {err ? (
                  <p
                    style={{
                      color: "red",
                      fontSize: "small",
                      marginBottom: "8px",
                      padding: "10px",
                      backgroundColor: "#f9b3b3",
                      display:"flex",
                      alignItems:"center",
                    }}
                  >
                    {err}
                  </p>
                ) : null}
                <div className="col col-12 text-center">
                  <button
                    type="submit"
                    class="btn btn-custom2 auth_form_btn"
                    onClick={handleSubmit}
                  >
                    <i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Log
                    in
                  </button>
                </div>
                <div class="col col-12 text-center mt-2">
                  <label>Don't have an account?&nbsp;</label>
                  <label onClick={() => handleSignupModal()}>
                    <a
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#ForgotPassModal"
                    >
                      Sign-up
                    </a>
                  </label>
                </div>
              </div>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

export default Login;

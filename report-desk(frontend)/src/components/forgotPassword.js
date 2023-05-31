import React, { useState } from "react";
import { Modal } from "antd";
import { Formik } from "formik";
import { Input } from "antd";
import { notification } from "antd";
import { forgotPassword } from "../Graphs/Auth/login";

const ForgotPassword = ({
  forgotPwdModalVisible,
  setForgotPwdModalVisible,
}) => {
  const [err, setErr] = useState("");
  const validateForm = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(values.email).toLowerCase()
      )
    ) {
      errors.email = "Please enter a valid email";
    }
  };
  const handleError = (error) => {
    setErr(error);
    console.log("Error From HandleError--", err);
  };

  const resetPassword = async (value) => {
    await forgotPassword(value)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setForgotPwdModalVisible(false);
          notification["success"]({
            message:
              "successfully sended code, Kindly check your mail for reset Password link",
          });
        } else if (res.status === 500) {
          console.log(res);
          handleError(res.message);
        }
      })
      .catch((err) => {
        handleError(err.message);
        console.log(err);
      });
  };

  const handleSubmit = (values) => {
    validateForm(values);
    resetPassword(values);
  };

  return (
    <div>
      <Modal
        destroyOnClose={true}
        visible={forgotPwdModalVisible}
        onCancel={() => setForgotPwdModalVisible(false)}
        footer={null}
      >
        <div>
          <Formik
            initialValues={{
              email: "",
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
                <>
                  <div className="modal_heading text-center mb-3">
                    <h4 className="modal-title mb-1" id="exampleModalLabel">
                      Reset your <span>password</span>
                    </h4>
                  </div>
                  <div className="formik-field_wrap row auth_form">
                    <div className="formik-field-left col col-lg-12 col-12 auth_field">
                      Email
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
                      className="btn btn-custom2 auth_form_btn"
                      onClick={handleSubmit}
                    >
                      <i className="fa-solid fa-circle-check me-2"></i>Submit
                    </button>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPassword;

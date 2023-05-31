import React, { useState, useMemo } from "react";
import { Formik } from "formik";
import { Input, Select, Modal } from "antd";
import { notification } from "antd";
import Otp from "./otp";
import { callSignUp } from "../Graphs/Auth/signUp";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Signup = ({
  showSignupModal,
  setShowSignupModal,
  handleOtpModalVisible,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [err, setErr] = useState("");
  const options = useMemo(() => countryList().getData(), []);

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

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password !== "" && values.password.length < 8) {
      errors.password = "At least 8 characters required";
    }

    if (values.password !== values.confirm_password) {
      errors.confirm_password = "Password and Confirm password does not match.";
    }

    if (!values.first_name) {
      errors.first_name = "First name is required";
    }

    if (!values.last_name) {
      errors.last_name = "Last name is required";
    }

    if (!values.selected_country) {
      errors.selected_country = "Please select country";
    }

    if (!values.termsCondition) {
      errors.termsCondition = "Please accept the terms & condition";
    }

    console.log("Validating errors -- ", errors);

    return errors;
  };

  const doSignUp = async (values) => {
    await callSignUp(values)
      .then((res) => {
        if (res.status === 200) {
          notification["success"]({
            message:
              "Registered successfully. Kindly check your mail for account verification",
          });
          setShowSignupModal(false);
        } else if (res.status === 500) {
          console.log(res);
          handleError(res.message);
        }
      })
      .catch((error) => {
        handleError(error.message);
        console.log(error);
      });
  };

  const handleSubmit = async (values, action) => {
    validateForm(values);
    values = {
      ...values,

      phone: values.selected_CountryCode + values.phone,
    };
    doSignUp(values);
  };

  const handleError = (error) => {
    setErr(error);
  };

  const handleSelectedCountry = (selectedValue, setFieldValue) => {
    setFieldValue("selected_country", selectedValue);
  };
  const handlePhoneInput = async (e, setFieldValue) => {
    setFieldValue("phone", e);
  };

  return (
    <Modal
      destroyOnClose={true}
      visible={showSignupModal}
      onCancel={() => setShowSignupModal(false)}
      footer={null}
    >
      <div>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            selected_CountryCode: "",
            phone: "",
            comapny_name: "",
            selected_country: "",
            password: "",
            confirm_password: "",
            termsCondition: false,
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
                <div className="modal_heading text-center mb-3">
                  <h4 className="modal-title mb-1" id="exampleModalLabel">
                    Create a <span>free account</span>
                  </h4>
                </div>
                <div className="formik-field_wrap row auth_form">
                  <div className="formik-field-left col col-lg-6 col-12 auth_field">
                    First Name
                    <Input
                      style={{ padding: "10px 15px" }}
                      id="first_name"
                      placeholder="First Name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.first_name && touched.first_name ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.first_name}
                      </p>
                    ) : null}
                  </div>

                  <div className="formik-field-right col col-lg-6 col-12 auth_field">
                    Last Name
                    <Input
                      style={{ padding: "10px 15px" }}
                      id="last_name"
                      placeholder="Last Name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.last_name && touched.last_name ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.last_name}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="formik-field_wrap row auth_form">
                  <div className="formik-field-left col col-lg-6 col-12 auth_field">
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

                  <div className="formik-field-right col col-lg-6 col-12 auth_field">
                    Phone
                    <div className="input-group col col-12 col-sm-12">
                      <PhoneInput
                        international
                        id="phone"
                        countryCallingCodeEditable={false}
                        defaultCountry="IN"
                        value={value}
                        onChange={(e) => handlePhoneInput(e, setFieldValue)}
                        onBlur={handleBlur}
                        className="col-lg-12 col-sm-12"
                      />
                    </div>
                    {errors.phone && touched.phone ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="formik-field auth_form">
                  <div className="formik-field auth_field">
                    Company Name
                    <Input
                      style={{ padding: "10px 15px" }}
                      id="company_name"
                      placeholder="Company Name"
                      value={values.company_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.comapny_name && touched.comapny_name ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.comapny_name}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="formik-field_wrap row auth_form mt-3">
                  <div className="formik-field-left col col-lg-12 col-12 auth_field">
                    Select country
                    <Select
                      allowClear
                      showSearch
                      id="selected_country"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleSelectedCountry(value, setFieldValue)
                      }
                      placeholder="Select country"
                      options={options}
                      optionFilterProp="children"
                      onBlur={handleBlur}
                      filterOption={(input, option) =>
                        option.props?.value
                          ?.toLowerCase()
                          ?.indexOf(input?.toLowerCase()) >= 0 ||
                        option.props?.label
                          ?.toLowerCase()
                          ?.indexOf(input?.toLowerCase()) >= 0
                      }
                    ></Select>
                    {errors.selected_country && touched.selected_country ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.selected_country}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="formik-field_wrap row auth_form mt-3">
                  <div className="formik-field-right col col-lg-6 col-12 auth_field">
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
                  <div className="formik-field-right col col-lg-6 col-12 auth_field">
                    Confirm Password
                    <Input
                      style={{ padding: "10px 15px" }}
                      type="password"
                      id="confirm_password"
                      placeholder="Confirm Password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirm_password && touched.confirm_password ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: "small",
                          margin: "0",
                        }}
                      >
                        {errors.confirm_password}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="col col-12 mb-3">
                  <Input
                    style={{ padding: "10px 15px", width: "20px" }}
                    type="checkbox"
                    id="termsCondition"
                    value={values.termsCondition}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    Please accept the&nbsp;
                    <a href="terms-and-conditions" target="_blank">
                      terms & conditions
                    </a>
                  </label>
                  {errors.termsCondition && touched.termsCondition ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "small",
                        margin: "0",
                      }}
                    >
                      {errors.termsCondition}
                    </p>
                  ) : null}
                </div>
                {err ? (
                  <p
                    style={{
                      color: "red",
                      fontSize: "small",
                      marginBottom: "8px",
                      padding: "10px",
                      backgroundColor: "#f9b3b3",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {err}
                  </p>
                ) : null}
                <div className="col col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-custom2 auth_form_btn"
                    data-bs-toggle="modal"
                    data-bs-target="#OtpModal"
                    onClick={handleSubmit}
                  >
                    <i className="fa-solid fa-circle-check me-2"></i>Create
                    Account
                  </button>
                </div>
                <Modal
                  destroyOnClose={true}
                  visible={open}
                  onCancel={() => setOpen(false)}
                  footer={null}
                >
                  <Otp />
                </Modal>
              </div>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default Signup;

import React, { useState, useMemo } from "react";
import { Collapse } from "antd";
import { Formik } from "formik";
import { Input, Select, Modal, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import withProvider from "../../hoc/WithProvider";
import { userProfile, resetPassword } from "../../Graphs/Auth/userProfile";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { setLoginUserData, setLoginFlag } from "../../actions/auth";

const Index = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const callback = (key) => {
    console.log(key);
  };

  const options = useMemo(() => countryList().getData(), []);
  const [value, setValue] = useState();
  const userData = useSelector((state) => state?.auth?.loginUserData);

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

    if (!values.first_name) {
      errors.first_name = "First name is required";
    }

    if (!values.last_name) {
      errors.last_name = "Last name is required";
    }

    if (!values.country) {
      errors.country = "Please select your counrty";
    }

    console.log("Validating errors -- ", errors);

    return errors;
  };

  const validatePasswordForm = (values) => {
    const errors = {};
    if (!values.oldPassword) {
      errors.oldPassword = "Old Password is required";
    }

    if (!values.newPassword) {
      errors.newPassword = "New Password is required";
    } else if (values.newPassword !== "" && values.newPassword.length < 8) {
      errors.password = "At least 8 characters required";
    }

    if (values.newPassword !== values.reEnterPassword) {
      errors.reEnterPassword =
        "New Password and Re-entered password does not match.";
    }

    return errors;
  };

  const handleSelectedCountry = (selectedValue, setFieldValue) => {
    setFieldValue("selected_country", selectedValue);
  };

  const setUserProfile = async (values) => {
    await userProfile(values)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLoginFlag(true));
          dispatch(setLoginUserData(values));
          notification["success"]({
            message: "Profile updated Successfully",
          });
        } else if (res.status === 500) {
          notification["error"]({
            message: "Failed to Update",
          });
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Failed to Update",
        });
      });
  };

  const resetLoginPassword = async (values) => {
    await resetPassword(values)
      .then((res) => {
        if (res.status === 200) {
          notification["success"]({
            message: "Password updated Successfully",
          });
        } else if (res.status === 500) {
          notification["error"]({
            message: "Failed to Update",
          });
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Failed to Update",
        });
      });
  };

  const handleSubmit = async (values, action) => {
    validateForm(values);
    values = {
      ...values,

      phone: values.selected_CountryCode + values.phone,
    };
    setUserProfile(values);
  };

  const handleSubmitPassword = async (values, { resetForm }) => {
    validatePasswordForm(values);
    resetLoginPassword(values);
    resetForm({ values: "" });
  };

  const handlePhoneInput = async (e, setFieldValue) => {
    // setValue(e);
    setFieldValue("phone", e);
  };

  const changePasswordForm = (
    <>
      <div>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
          validate={validatePasswordForm}
          onSubmit={handleSubmitPassword}
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
              <div className="formik-field_wrap row auth_form mt-3">
                <div className="formik-field-right col  col-12 auth_field">
                  Old Password
                  <Input
                    style={{ padding: "10px 15px" }}
                    type="password"
                    id="oldPassword"
                    placeholder="Old Password"
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.oldPassword && touched.oldPassword ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "small",
                        margin: "0",
                      }}
                    >
                      {errors.oldPassword}
                    </p>
                  ) : null}
                </div>
                <div className="formik-field-right col  col-12 auth_field">
                  New Password
                  <Input
                    style={{ padding: "10px 15px" }}
                    type="password"
                    id="newPassword"
                    placeholder="New Password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.newPassword && touched.newPassword ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "small",
                        margin: "0",
                      }}
                    >
                      {errors.newPassword}
                    </p>
                  ) : null}
                </div>
                <div className="formik-field-right col  col-12 auth_field">
                  Re-enter Password
                  <Input
                    style={{ padding: "10px 15px" }}
                    type="password"
                    id="reEnterPassword"
                    placeholder="Re Enter Password"
                    value={values.reEnterPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.reEnterPassword && touched.reEnterPassword ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "small",
                        margin: "0",
                      }}
                    >
                      {errors.reEnterPassword}
                    </p>
                  ) : null}
                </div>
                <div className="col col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-custom2 auth_form_btn"
                    data-bs-toggle="modal"
                    data-bs-target="#OtpModal"
                    onClick={handleSubmit}
                  >
                    <i className="fa-solid fa-circle-check me-2"></i>
                    Save Password
                  </button>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </>
  );
  return (
    <div>
      {/* <!-- Page Heading --> */}
      <section className="position-relative sub_page_title bg_light_blue">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="position-relative text-center">
                <h2>
                  Welcome <span>{userData?.first_name}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Personal Details --> */}
      <section className="position-relative bg_light_blue contact_form section_pad pt-0 pb-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-lg-8 col-md-12 col-12">
              <div className="detailed_content my_prof bg-white shadow-sm">
                <h2>
                  Personal <span>Details</span>
                </h2>
                <div>
                  <Formik
                    initialValues={{
                      first_name: `${userData?.first_name}`,
                      last_name: `${userData?.last_name}`,
                      email: `${userData?.email}`,
                      selected_CountryCode: "",
                      phone: `${userData?.phone}`,
                      company_name: `${userData?.company_name}`,
                      country: `${userData?.country}`,
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
                              <PhoneInput
                                international
                                id="phone"
                                countryCallingCodeEditable={false}
                                defaultCountry="IN"
                                value={values.phone}
                                onChange={(e) =>
                                  handlePhoneInput(e, setFieldValue)
                                }
                                onBlur={handleBlur}
                              />
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
                              {errors.company_name && touched.company_name ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0",
                                  }}
                                >
                                  {errors.company_name}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="formik-field_wrap row auth_form mt-3">
                            <div className="formik-field-left col col-lg-12 col-12 auth_field">
                              Country
                              <Select
                                id="country"
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                  handleSelectedCountry(value, setFieldValue)
                                }
                                placeholder="Select country"
                                showSearch
                                defaultValue={values.country}
                                optionFilterProp="children"
                                onBlur={handleBlur}
                                options={options}
                                filterOption={(input, option) =>
                                  option.props?.value
                                    ?.toLowerCase()
                                    ?.indexOf(input?.toLowerCase()) >= 0 ||
                                  option.props?.label
                                    ?.toLowerCase()
                                    ?.indexOf(input?.toLowerCase()) >= 0
                                }
                              ></Select>
                              {errors.country && touched.country ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0",
                                  }}
                                >
                                  {errors.country}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="col col-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-custom2 auth_form_btn"
                              data-bs-toggle="modal"
                              data-bs-target="#OtpModal"
                              onClick={handleSubmit}
                            >
                              <i className="fa-solid fa-circle-check me-2"></i>
                              save changes
                            </button>
                          </div>
                          <Modal
                            destroyOnClose={true}
                            // visible={open}
                            // onCancel={() => setOpen(false)}
                            footer={null}
                          >
                            {/* <Otp /> */}
                          </Modal>
                        </div>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Change Password --> */}
      <section className="position-relative bg_light_blue contact_form section_pad pt-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-lg-8 col-md-12 col-12">
              <div className="detailed_content my_prof bg-white shadow-sm">
                <h2
                  className="mb-0"
                  data-bs-toggle="collapse"
                  href="#collapseExample"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <Collapse defaultActiveKey={["1"]} onChange={callback}>
                    <Panel showArrow="right" header="Change Password" key="1">
                      <>{changePasswordForm}</>
                    </Panel>
                  </Collapse>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withProvider(Index);

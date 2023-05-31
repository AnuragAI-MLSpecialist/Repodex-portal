import React, { useState } from "react";
import withProvider from "../../hoc/WithProvider";
import { sendCustomMail } from "../../Graphs/Auth/contactUs";
import { Formik } from "formik";
import { Input } from "antd";
import { notification } from "antd";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Index = () => {
  const [value, setValue] = useState();
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

    if (!values.subject) {
      errors.subject = "Subject is required";
    }

    if (!values.phone) {
      errors.phone = "Phone Number is required";
    }

    if (!values.first_name) {
      errors.first_name = "First name is required";
    }

    if (!values.last_name) {
      errors.last_name = "Last name is required";
    }

    console.log("Validating errors -- ", errors);

    return errors;
  };

  const doCustomMail = async (values) => {
    await sendCustomMail(values)
      .then((res) => {
        if (res.status === 200) {
          notification["success"]({
            message: "Request Successfully Submitted",
          });
        } else if (res.status === 500) {
          notification["error"]({
            message: "Kindly Verify your Email, This User is already exist",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (values, action) => {
    validateForm(values);
    values = {
      ...values,

      phone: values.selected_CountryCode + values.phone,
    };
    doCustomMail(values);
  };

  const handlePhoneInput = async (e, setFieldValue) => {
    // setValue(e);
    setFieldValue("phone", e);
  };
  return (
    <div>
      {/* <!-- Page Heading --> */}
      <section className="position-relative sub_page_title bg_light_blue">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="position-relative text-center">
                <h2>
                  Get in <span>touch</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- About --> */}
      <section className="position-relative bg_light_blue contact_form section_pad pt-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-lg-8 col-md-12 col-12">
              <div className="detailed_content bg-white shadow-sm">
                <h2>
                  We will be <span>happy to help you</span>
                </h2>
                <p>
                  Feel free to contact us anytime through the form. We will
                  respond to your inquiry as quickly as possible.
                </p>

                <div>
                  <Formik
                    initialValues={{
                      first_name: "",
                      last_name: "",
                      email: "",
                      selected_CountryCode: "",
                      phone: "",
                      subject: "",
                      request_message: "",
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
                        <div className="mt-3">
                          <div className="modal_heading text-center mb-3"></div>
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
                                value={value}
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
                              Subject
                              <Input
                                style={{ padding: "10px 15px" }}
                                id="subject"
                                placeholder="Your Subject"
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {errors.subject && touched.subject ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0",
                                  }}
                                >
                                  {errors.subject}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="formik-field auth_form">
                            <div className="formik-field auth_field">
                              Your Request
                              <Input
                                style={{ padding: "10px 15px" }}
                                id="request_message"
                                placeholder="Your Request"
                                value={values.request_message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {errors.request_message &&
                              touched.request_message ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0",
                                  }}
                                >
                                  {errors.request_message}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="col-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-custom2"
                              onClick={handleSubmit}
                            >
                              <i className="fa-solid fa-circle-check me-2"></i>
                              Submit
                            </button>
                          </div>
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

      {/* <!-- Skype email --> */}
      <section className="position-relative contact_info_out">
        <div className="container">
          <div className="row g-0">
            <div className="col col-md-6 col-12 border-end contact_info">
              <div className="detailed_content">
                <h5 className="text-white">
                  <i className="fa-brands fa-skype me-3"></i>
                  info@thereportdesk.com
                </h5>
              </div>
            </div>
            <div className="col col-md-6 col-12 contact_info">
              <div className="detailed_content">
                <h5 className="text-white">
                  <i className="fa-solid fa-envelope-open-text me-3"></i>
                  info@thereportdesk.com
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withProvider(Index);

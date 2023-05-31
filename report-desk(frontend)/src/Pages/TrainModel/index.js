import React, { useState } from "react";
import axios from "axios";
import withProvider from "../../hoc/WithProvider";
//import { sendCustomMail } from "../../Graphs/Auth/contactUs";
import { Formik } from "formik";
import { Input } from "antd";
import "react-phone-number-input/style.css";
const Index = () => {
  const [subject,setSubject] = useState();
  //const [value, setValue] = useState("");
  const validateForm = (values) => {
    const errors = {};

    if (!values.subject) {
      errors.subject = "Question is required";
    }

    console.log("Validating errors -- ", errors);

    return errors;
  };

  const handleSubmit = async (values, action) => {
    validateForm(values);
    values = {
      ...values
    };
    const resp = await axios.post('http://127.0.0.1:5000/train_model', values);
    if (resp.success) {
      alert('Data Submitted');
      window.location.reload();
    }

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
                  Train the  <span>Model</span>
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
                  Fill the Question and their Answer to<span> Train the model</span>
                </h2>

                <div>
                  <Formik
                    initialValues={{

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
                      setSubject(values.subject);
                      return (
                        <div className="mt-3">
                          <div className="modal_heading text-center mb-3"></div>


                          <div className="formik-field auth_form">
                            <div className="formik-field auth_field">
                              Question
                              <Input
                                style={{ padding: "10px 15px" }}
                                id="subject"
                                placeholder="Your Question"
                                value={subject}
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
                              Your Answer
                              <Input
                                style={{ padding: "10px 15px" }}
                                id="request_message"
                                placeholder="Your Answer"
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


    </div>
  );
};

export default withProvider(Index);

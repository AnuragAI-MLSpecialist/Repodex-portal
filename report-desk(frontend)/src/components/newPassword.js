import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Input, Select, Modal } from "antd";
import { notification } from "antd";
import { useHistory } from "react-router";
import withProvider from "../hoc/WithProvider";
import { useParams } from "react-router";
import {setNewPassword} from '../Graphs/Auth/setNewPassword';

const NewPassword = () => {
  const [otpModalVisible, setOtpModalVisible] = useState(true);
  const [code,setCode] = useState('')
  const param = useParams();
  const history = useHistory();

  useEffect(()=>{
    setCode(param.code)
  },[])
  const validatePasswordForm = (values) => {
    const errors = {};

    if (!values.newPassword) {
      errors.newPassword = "New Password is required";
    } else if (values.newPassword !== "" && values.newPassword.length < 8) {
      errors.password = "At least 8 characters required";
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword =
        "New Password and confirm password does not match.";
    }
    return errors;

    
  };

  const setPassword = async(values) =>{
      await setNewPassword(values)
      .then((res)=>{
          console.log(res);
          if(res.status === 200){
            setOtpModalVisible(false)
            notification["success"]({
              message:
                "Your Password is reset successfully, Please Login"
            });
            history.push("/dashboard");
          }
      }).catch((err)=>{
          console.log(err);
      })
  }

  const handleSubmitPassword = (values) => {
    setPassword({...values,code})
  };
  return (
    <>
      <div style={{ height: "50%" }}></div>
      <Modal
        destroyOnClose={true}
        visible={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <div>
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
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
                <>
                  <div className="modal_heading text-center mb-3">
                    <h4 className="modal-title mb-1" id="exampleModalLabel">
                      Reset <span>Password</span>
                    </h4>   
                  </div>
                  <div className="formik-field_wrap row auth_form mt-3">
                    <div className="formik-field-right col  col-12 auth_field">
                      New Password
                      <Input
                        style={{ padding: "10px 15px" }}
                        type="password"
                        id="newPassword"
                        placeholder="newPassword"
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
                      Confirm Password
                      <Input
                        style={{ padding: "10px 15px" }}
                        type="password"
                        id="confirmPassword"
                        placeholder="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.confirmPassword && touched.confirmPassword ? (
                        <p
                          style={{
                            color: "red",
                            fontSize: "small",
                            margin: "0",
                          }}
                        >
                          {errors.confirmPassword}
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
                        Reset Password
                      </button>
                    </div>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default withProvider(NewPassword);

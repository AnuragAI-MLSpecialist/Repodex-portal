import React from "react";
import { Modal } from "antd";

const Otp = (otpModalVisible, setOtpModalVisible) => {
  return (
    <Modal
      destroyOnClose={true}
      visible={otpModalVisible}
      onCancel={() => setOtpModalVisible(false)}
      footer={null}
    >
      <div>
        <div className="modal_heading text-center mb-3">
          <h4 className="modal-title mb-1" id="exampleModalLabel">
            Almost <span>there</span>
          </h4>
          <p>
            <small>
              Please enter the 6 digit OTP that we just sent on test@test.com
            </small>
          </p>
        </div>

        <form className="row auth_form">
          <div className="col col-12 auth_field">
            <div
              id="otp"
              className="inputs d-flex flex-row justify-content-center mt-2"
            >
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="first"
                maxlength="1"
              />
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="second"
                maxlength="1"
              />
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="third"
                maxlength="1"
              />
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="fourth"
                maxlength="1"
              />
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="fifth"
                maxlength="1"
              />
              <input
                className="m-2 text-center form-control rounded"
                type="text"
                id="sixth"
                maxlength="1"
              />
            </div>
          </div>
          <div class="col col-12 text-center">
            <button type="submit" class="btn btn-custom2 auth_form_btn">
              <i class="fa-solid fa-circle-check me-2"></i>Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Otp;

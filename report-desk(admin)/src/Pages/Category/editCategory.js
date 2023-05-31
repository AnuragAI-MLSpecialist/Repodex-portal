import React, { useState } from "react";
import { Modal } from "antd";

export function EditCategory({ onClose, onSubmit, categoryData }) {
  const [categoryName, setCategoryName] = useState(categoryData.name);

  return (
    <Modal
      visible={true}
      title={"Edit Category"}
      onCancel={onClose}
      width={500}
      footer={null}
    >
      <div className="row m-0 pb-3">
        <div className="col-md-12 col-12">
          <div className="row">
            <label
              className="col-sm-4 col-form-label pe-0"
              htmlFor="basic-default-name"
            >
              Category Name
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="basic-default-name"
                placeholder="e.g. Automotive"
                onChange={(event) => setCategoryName(event.target.value)}
                required={true}
                value={categoryName}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row m-0">
        <div className="col-md-4 col-4">
          <button
            type="submit"
            onClick={() => {
              onClose();
              onSubmit({
                name: categoryName,
                id: categoryData._id,
              });
            }}
            className="btn btn-primary"
          >
            <i className="far fa-check-circle me-2" />
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

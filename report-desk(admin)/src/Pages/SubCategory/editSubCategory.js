import React, { useState } from "react";
import { Modal } from "antd";

export function EditSubCategory({
  onClose,
  onSubmit,
  categoryData,
  categoryOptions,
}) {
  const [categoryName, setCategoryName] = useState(categoryData.name);
  const [categoryId, setCategoryId] = useState(categoryData.category_id._id);

  return (
    <Modal
      visible={true}
      title={"Edit Sub Category"}
      onCancel={onClose}
      width={500}
      footer={null}
    >
      <div className="row m-0 pb-3">
        <div className="col-md-12 col-12">
          <label className="col-form-label pe-0" for="basic-default-name">
            Category Name
          </label>
          <select
            className="form-select"
            onChange={(event) => {
              setCategoryId(event.target.value);
            }}
            defaultValue={categoryId}
            value={categoryId}
            required={true}
          >
            <option selected disabled>
              Select Category
            </option>
            {categoryOptions &&
              categoryOptions.map((data) => {
                return <option value={data._id}>{data.name}</option>;
              })}
          </select>
        </div>
      </div>

      <div className="row m-0 pb-3">
        <div className="col-md-12 col-12">
          <div className="row">
            <label
              className="col-sm-4 col-form-label pe-0"
              htmlFor="basic-default-name"
            >
              Sub Category Name
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
                category_id: categoryId,
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

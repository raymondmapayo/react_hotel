import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      gender: "",
      status: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Name must be at least 2 characters").required("Required"),
      email: Yup.string().email("Invalid email format. Please enter a valid email address").required("Required"),
      gender: Yup.string().required("Gender is required"),
      status: Yup.string().required("Status is required"),
      phone: Yup.string().required("Phone is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:8081/user/${id}`, values);
        console.log("User updated successfully");
        navigate("/userlist");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
  });

useEffect(() => {
    fetch(`http://localhost:8081/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        formik.setValues({
          name: data[0].name,
          email: data[0].email,
          gender: data[0].gender,
          status: data[0].status,
          phone: data[0].phone,
        });
      })
      .catch((err) => console.log(err));
  }, [id, formik.setValues]);

  const handleUpdateItem = () => {
    formik.handleSubmit();
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="container mx-auto mt-6" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="d-flex flex-column align-items-center">
            <h2 className="text-center mb-4">Edit User</h2>
            <label className="form-label">Enter name:</label>
            <input
              className={`form-control mb-3 ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
              type="text"
              placeholder="Name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}

        <label className="form-label">Enter email:</label>
        <input
          className={`form-control mb-3 ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
          type="text"
          placeholder="Email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="invalid-feedback">{formik.errors.email}</div>
        )}

        <label className="form-label">Select Gender:</label>
        <select
          className={`form-control mb-3 ${formik.touched.gender && formik.errors.gender ? "is-invalid" : ""}`}
          placeholder="Gender"
          {...formik.getFieldProps("gender")}
        >
          <option value="" label="Select Gender" />
          <option value="male" label="Male" />
          <option value="female" label="Female" />
          <option value="other" label="Other" />
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <div className="invalid-feedback">{formik.errors.gender}</div>
        )}

        <label className="form-label">Select Status:</label>
        <select
          className={`form-control mb-3 ${formik.touched.status && formik.errors.status ? "is-invalid" : ""}`}
          placeholder="Status"
          {...formik.getFieldProps("status")}
        >
          <option value="" label="Select Status" />
          <option value="single" label="Single" />
          <option value="married" label="Married" />
          <option value="divorced" label="Divorced" />
          <option value="widowed" label="Widowed" />
        </select>
        {formik.touched.status && formik.errors.status && (
          <div className="invalid-feedback">{formik.errors.status}</div>
        )}

        <label className="form-label">Enter phone:</label>
        <input
          className={`form-control mb-3 ${formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}`}
          type="text"
          placeholder="Phone"
          {...formik.getFieldProps("phone")}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="invalid-feedback">{formik.errors.phone}</div>
        )}

        <button className="btn btn-primary" onClick={handleUpdateItem}>
          Update &nbsp;
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default EditUser;
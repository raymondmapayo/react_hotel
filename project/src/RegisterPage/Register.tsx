import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import './register.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  faUser,
  faEnvelope,
  faLock,
  faVenusMars,
  faHeart,
  faBirthdayCake,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const Register: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      gender: "",
      status: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must have at least 3 characters")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must have at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .min(6, "Password must have at least 6 characters")
        .required("Required"),
      gender: Yup.string().required("Gender is required"),
      status: Yup.string().required("Civil status is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Phone is required"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:8081/add_register", values)
        .then((response) => {
          alert("Registration successful!");
          window.location.href = "/"; // Redirect to the home page
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          alert("Error registering user. Please try again.");
        });
    },
  });

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6" >
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5" >
                  <h2 className="text-uppercase text-center mb-5">
                    Register Form
                  </h2>

         <form onSubmit={formik.handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                      />
                      <label className="form-label" htmlFor="name">
                        Your Name
                      </label>
                      {formik.touched.name && formik.errors.name ? (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      ) : null}
                    </div>

          <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                      {formik.touched.email && formik.errors.email ? (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>

        <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      {formik.touched.password && formik.errors.password ? (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>

        <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`form-control ${
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                      />
                      <label className="form-label" htmlFor="confirmPassword">
                        Repeat your password
                      </label>
                      {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                        <div className="invalid-feedback">
                          {formik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>

                          {/* Gender Input */}
                    <div className="form-outline mb-4 position-relative">
                      <select
                        id="gender"
                        name="gender"
                        className={`form-control ${
                          formik.touched.gender && formik.errors.gender ? "is-invalid" : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        placeholder="Select Gender"
                      >
                        <option value="" label="Select Gender" />
                        <option value="male" label="Male" />
                        <option value="female" label="Female" />
                        <option value="other" label="Other" />
                      </select>
                      <label className="form-label" htmlFor="gender">
                        Select Gender
                      </label>
                      {formik.touched.gender && formik.errors.gender ? (
                        <div className="invalid-feedback">{formik.errors.gender}</div>
                      ) : null}
                    </div>

                          {/* Civil Status Input */}
                    <div className="form-outline mb-4 position-relative">
                      <select
                        id="status"
                        name="status"
                        className={`form-control ${
                          formik.touched.status && formik.errors.status ? "is-invalid" : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.status}
                        placeholder="Select Civil Status"
                      >
                        <option value="" label="Select Civil Status" />
                        <option value="single" label="Single" />
                        <option value="married" label="Married" />
                        <option value="divorced" label="Divorced" />
                        <option value="widowed" label="Widowed" />
                      </select>
                      <label className="form-label" htmlFor="status">
                        Select Civil Status
                      </label>
                      {formik.touched.status && formik.errors.status ? (
                        <div className="invalid-feedback">{formik.errors.status}</div>
                      ) : null}
                    </div>

                    {/* Phone Input */}
                    <div className="form-outline mb-4 position-relative">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className={`form-control ${
                          formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        placeholder="Your Phone"
                      />
                      <label className="form-label" htmlFor="phone">
                        Your Phone
                      </label>
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="invalid-feedback">{formik.errors.phone}</div>
                      ) : null}
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <Link to="/" className="fw-bold text-body">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

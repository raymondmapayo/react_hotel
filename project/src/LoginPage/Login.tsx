import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import Logo from "./images/logo.png"; // Import your logo image
import './css/style.css';
const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email Address.").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters.").required("Password is required"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:8081/user", values)
        .then((response) => {
         if (response.data.success) {
          localStorage.setItem("logged", "true");
          localStorage.setItem("userEmail", values.email); // Store the username
          setIsLoggedIn(true);
          window.location.href = "/reserve";
        } else {
            alert("Invalid login credentials. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          alert("Error logging in. Please try again.");
        });
    },
  });

  return (
    <section className="h-100 gradient-form">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black" style={{ backgroundColor: "#eee" }}>
              <div className="row g-0">
                <div className="col-lg-6 gradient-custom-login">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src={Logo} style={{ width: "185px" }} alt="logo" />
                      <h4 className="mt-1 mb-5 pb-1">ERJ Hotel</h4>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                      <p>Please login to your account</p>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                          placeholder="Phone number or email address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        <label className="form-label" htmlFor="email">
                          Username
                        </label>
                        {formik.touched.email && formik.errors.email ? (
                          <div className="invalid-feedback">{formik.errors.email}</div>
                        ) : null}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        {formik.touched.password && formik.errors.password ? (
                          <div className="invalid-feedback">{formik.errors.password}</div>
                        ) : null}
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-login mb-3"
                          type="submit"
                        >
                          Log in
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <Link to="/register" className="btn btn-outline-danger">
                          Create new
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

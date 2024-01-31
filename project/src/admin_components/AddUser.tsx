import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AddUser = () => {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            gender: "",
            status: "",
            phone: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2, "Name must be at least 2 characters").required("Required"),
            email: Yup.string().email("Invalid email format. Please enter a valid email address").required("Required"),
            password: Yup.string().required("Password is required"),
            gender: Yup.string().required("Gender is required"),
            status: Yup.string().required("Status is required"),
           phone: Yup.string().required("Phone is required"),
        }),
        onSubmit: (values) => {
            axios
                .post("http://localhost:8081/add_user", values)
                .then((response) => {
                    formik.resetForm();
                    console.log("response" + response.data);
                    alert("Added Successfully");
                })
                .catch((error) => {
                    console.error("Error adding user:", error);
                    formik.setStatus("Error adding user. Please try again.");
                });
        },
    });

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container m-8">
                <h2>Add User</h2>

                <form onSubmit={formik.handleSubmit}>
                    <label className="form-label">Enter Name:</label>
                    <input className="form-control" type="text" placeholder="Name" {...formik.getFieldProps("name")} />
                    {formik.touched.name && formik.errors.name && <p className="text-danger">{formik.errors.name}</p>}

                    <label className="form-label">Enter Email:</label>
                    <input className="form-control" type="text" placeholder="Email" {...formik.getFieldProps("email")} />
                    {formik.touched.email && formik.errors.email && <p className="text-danger">{formik.errors.email}</p>}


                     <label className="form-label">Enter Password:</label>
                    <input className="form-control" type="text" placeholder="Password" {...formik.getFieldProps("password")} />
                    {formik.touched.email && formik.errors.email && <p className="text-danger">{formik.errors.email}</p>}


                     <label className="form-label">Select Gender:</label>
                    <select className="form-control" {...formik.getFieldProps("gender")}>
                        <option value="" label="Select Gender" />
                        <option value="male" label="Male" />
                        <option value="female" label="Female" />
                        <option value="other" label="Other" />
                    </select>
                    {formik.touched.gender && formik.errors.gender && <p className="text-danger">{formik.errors.gender}</p>}

                     <label className="form-label">Select Status:</label>
                    <select className="form-control" {...formik.getFieldProps("status")}>
                        <option value="" label="Select Civil Status" />
                        <option value="single" label="Single" />
                        <option value="married" label="Married" />
                        <option value="divorced" label="Divorced" />
                        <option value="widowed" label="Widowed" />
                    </select>
                    {formik.touched.gender && formik.errors.status && <p className="text-danger">{formik.errors.status}</p>}

                      <label className="form-label">Enter Phone:</label>
                    <input className="form-control" type="text" placeholder="Phone" {...formik.getFieldProps("phone")} />
                    {formik.touched.phone && formik.errors.phone && <p className="text-danger">{formik.errors.phone}</p>}


                    {formik.status && <p className="text-danger">{formik.status}</p>}

                    <br />
                    <button className="btn btn-primary" type="submit">
                        Add User &nbsp;
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
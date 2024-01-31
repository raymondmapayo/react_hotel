import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AddRoom = () => {
    const formik = useFormik({
        initialValues: {
            room_name: "",
            room_prize: "",
            room_type: "",
            room_img: "", // Updated to an empty string
        },
        validationSchema: Yup.object({
            room_name: Yup.string().required("Room name is required"),
            room_prize: Yup.string().required("Room prize is required"),
            room_type: Yup.string().required("Room type is required"),
            room_img: Yup.mixed().required("Image is required"),
           
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("room_name", values.room_name);
            formData.append("room_prize", values.room_prize);
            formData.append("room_type", values.room_type);
            formData.append("room_img", values.room_img);
           

            axios
                .post("http://localhost:8081/add_rooms", formData)
                .then((response) => {
                    formik.resetForm();
                    console.log("response", response.data);
                    alert("Added Successfully");
                })
                .catch((error) => {
                    console.error("Error adding rooms:", error);
                    formik.setStatus("Error adding rooms. Please try again.");
                });
        },
    });

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container m-8">
                <h2>Add Rooms</h2>

                <form onSubmit={formik.handleSubmit}>
                    <label className="form-label">Enter Room Name:</label>
                    <input className="form-control" type="text" placeholder="Room name" {...formik.getFieldProps("room_name")} />
                    {formik.touched.room_name && formik.errors.room_name && <p className="text-danger">{formik.errors.room_name}</p>}

                    <label className="form-label">Enter Room prize:</label>
                    <input className="form-control" type="text" placeholder="Room prize" {...formik.getFieldProps("room_prize")} />
                    {formik.touched.room_prize && formik.errors.room_prize && <p className="text-danger">{formik.errors.room_prize}</p>}


                    <label className="form-label">Select Room Type:</label>
                    <select className="form-control" {...formik.getFieldProps("room_type")}>
                        <option value="" label="Select Room Type" />
                        <option value="Family Room" label="Family Room" />
                        <option value="Single Room" label="Single Room" />
                        <option value="Twin Room" label="Twin Room" />
                        <option value="Double Room" label="Double Room" />
                        <option value="Accessible Room" label="Accessible Room" />
                    </select>
                    {formik.touched.room_type && formik.errors.room_type && <p className="text-danger">{formik.errors.room_type}</p>}
                    <br></br>
                    <input
                        type="file"
                        accept="images/*"
                        onChange={(event) => {
                            const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                            formik.setFieldValue("room_img", file);
                            
                        }}
                    />
                    {formik.touched.room_img && formik.errors.room_img && <p className="text-danger">{formik.errors.room_img}</p>}
                        <br></br>
                    

                    <br />
                    <button className="btn btn-primary" type="submit">
                        Add Rooms &nbsp;
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRoom;

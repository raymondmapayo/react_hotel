import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      room_name: "",
      room_prize: "",
      room_type: "",
      room_img: null,
      room_status: "",
    },
    validationSchema: Yup.object({
      room_name: Yup.string().required("Room name is required"),
      room_prize: Yup.string().required("Room prize is required"),
      room_type: Yup.string().required("Room type is required"),
      room_status: Yup.string().required("Room status is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("room_name", values.room_name);
      formData.append("room_prize", values.room_prize);
      formData.append("room_type", values.room_type);
      formData.append("room_status", values.room_status);

      // Only append the new image if it's provided
      if (values.room_img) {
        formData.append("room_img", values.room_img);
      } else {
        // If no new image is provided, fetch the existing image from the server
        const existingImage = await axios
          .get(`http://localhost:8081/rooms/${id}`)
          .then((response) => response.data[0].room_img);

        formData.append("room_img", existingImage);
      }

      try {
        const response = await axios.put(`http://localhost:8081/rooms/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("response:", response.data);
        navigate("/rooms");
      } catch (error) {
        console.error("Error updating room:", error);
      }
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/rooms/${id}`);
        const roomData = response.data[0];

        formik.setValues({
          room_name: roomData.room_name,
          room_prize: roomData.room_prize,
          room_type: roomData.room_type,
          room_img: roomData.room_img, // Set the existing image directly
          room_status: roomData.room_status,
        });
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id, formik.setValues]);

  const handleUpdateItem = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      }
    });
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ width: "80%" }}>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="container mx-auto mt-6" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="d-flex flex-column align-items-center">
            <h2 className="text-center mb-4">Edit Room</h2>
            <label className="form-label">Enter Room name:</label>
            <input
              className={`form-control mb-3 ${formik.touched.room_name && formik.errors.room_name ? "is-invalid" : ""}`}
              type="text"
              placeholder="Room name"
              {...formik.getFieldProps("room_name")}
            />
            {formik.touched.room_name && formik.errors.room_name && (
              <div className="invalid-feedback">{formik.errors.room_name}</div>
            )}

            <label className="form-label">Enter Prize:</label>
            <input
              className={`form-control mb-3 ${formik.touched.room_prize && formik.errors.room_prize ? "is-invalid" : ""}`}
              type="text"
              placeholder="Enter prize"
              {...formik.getFieldProps("room_prize")}
            />
            {formik.touched.room_prize && formik.errors.room_prize && (
              <div className="invalid-feedback">{formik.errors.room_prize}</div>
            )}

            <label className="form-label">Select Type:</label>
            <select
              className={`form-control mb-3 ${formik.touched.room_type && formik.errors.room_type ? "is-invalid" : ""}`}
              placeholder="Room type"
              {...formik.getFieldProps("room_type")}
            >
              <option value="" label="Select Room type" />
              <option value="familyroom" label="Familyroom" />
              <option value="twinroom" label="Twinroom" />
              <option value="doubleroom" label="Doubleroom" />
            </select>
            {formik.touched.room_type && formik.errors.room_type && (
              <div className="invalid-feedback">{formik.errors.room_type}</div>
            )}

            <label className="form-label">Existing Image:</label>
            {formik.values.room_img && (
              <img
                src={`http://localhost:8081/images/${formik.values.room_img}`}
                alt={`Existing Room Image`}
                style={{ width: "80%", height: "auto", marginBottom: "10px" }}
              />
            )}

            <label className="form-label">Upload image:</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control mb-3 ${formik.touched.room_img && formik.errors.room_img ? "is-invalid" : ""}`}
              onChange={(event) => {
                formik.setFieldTouched("room_img", true);
                formik.setFieldValue("room_img", event.currentTarget.files?.[0]);
              }}
            />
            {formik.touched.room_img && formik.errors.room_img && (
              <div className="invalid-feedback">{formik.errors.room_img}</div>
            )}

            <label className="form-label">Select Room status:</label>
            <select
              className={`form-control mb-3 ${formik.touched.room_status && formik.errors.room_status ? "is-invalid" : ""}`}
              placeholder="Room status"
              {...formik.getFieldProps("room_status")}
            >
              <option value="" label="Select Status" />
              <option value="occupied" label="Occupied" />
              <option value="free" label="Free" />
              <option value="reserve" label="Reserve" />
            </select>
            {formik.touched.room_status && formik.errors.room_status && (
              <div className="invalid-feedback">{formik.errors.room_status}</div>
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

export default EditRoom;

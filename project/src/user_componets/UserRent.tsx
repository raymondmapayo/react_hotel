import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from "@fortawesome/free-solid-svg-icons";

const UserRent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const formik = useFormik({
    initialValues: {
      room_name: "",
      room_prize: "",
      room_type: "",
      checkin_date: "",
      checkout_date: "",
      room_img: null,
      room_status: "",
    },
    validationSchema: Yup.object({
      room_name: Yup.string().required("Room name is required"),
      room_prize: Yup.string().required("Room prize is required"),
      room_type: Yup.string().required("Room type is required"),
      checkin_date: Yup.date().required("Check-in date is required"),
      checkout_date: Yup.date().required("Check-out date is required"),
      room_img: Yup.mixed().required("Room image is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("room_name", values.room_name);
        formData.append("room_prize", values.room_prize);
        formData.append("room_type", values.room_type);
        formData.append("checkin_date", values.checkin_date);
        formData.append("checkout_date", values.checkout_date);
        formData.append("room_status", values.room_status);

        if (userEmail) {
          formData.append("userEmail", userEmail);
        }

        if (values.room_img !== null) {
          formData.append("room_img", values.room_img);
        }

        const response = await axios.post(`http://localhost:8081/room_serve/${id}`, formData);
        console.log("Reservation Response:", response.data);
        alert("Room reserved successfully");
        navigate("/reserve");
      } catch (error) {
        console.error("Error reserving room:", error);
        alert("Error reserving room. Please try again.");
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
          room_img: roomData.room_img,
          checkin_date: roomData.checkin_date,
          checkout_date: roomData.checkout_date,
          room_status: roomData.room_status,
        });
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id, formik.setValues]);

  return (
    <div className="user-rent-container">
      <div className="user-rent-content d-flex justify-content-center">
        <div>
          <h2 className="text-center mb-4">Room</h2>

          <table className="table">
            <tbody>
              <tr>
                <th>Room Name:</th>
                <td>{formik.values.room_name}</td>
              </tr>
              <br></br>
              <tr>
                <th>Room Type:</th>
                <td>{formik.values.room_type}</td>
              </tr>
              <br></br>
              <tr>
                <th>Room Image:</th>
                <td>
                  {formik.values.room_img && (
                    <img
                      src={`http://localhost:8081/images/${formik.values.room_img}`}
                      alt={`Existing Room Image`}
                      className="existing-image"
                      style={{ maxWidth: "30%", height: "auto" }}
                    />
                  )}
                </td>
              </tr>
              <br></br>
              <tr>
                <th>Check-in Date:</th>
                <td>
                  <input
                    type="date"
                    id="checkin_date"
                    name="checkin_date"
                    value={formik.values.checkin_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                  />
                  {formik.touched.checkin_date && formik.errors.checkin_date ? (
                    <div className="error">{formik.errors.checkin_date}</div>
                  ) : null}
                </td>
              </tr>

              <br></br>
              <tr>
                <th>Check-out Date:</th>
                <td>
                  <input
                    type="date"
                    id="checkout_date"
                    name="checkout_date"
                    value={formik.values.checkout_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                  />
                  {formik.touched.checkout_date && formik.errors.checkout_date ? (
                    <div className="error">{formik.errors.checkout_date}</div>
                  ) : null}
                </td>
              </tr>
              <br></br>
              <tr>
                <th>Prize:</th>
                <td>{formik.values.room_prize}</td>
              </tr>
              <br></br>
              <tr>
                <th>Room Status:</th>
                <td>{formik.values.room_status}</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <button className="btn btn-success" onClick={formik.submitForm}>
  Serve &nbsp;
  <FontAwesomeIcon icon={faServer} />
</button>

        </div>
      </div>
    </div>
  );
};

export default UserRent;

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

const UserProceed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const formik = useFormik({
    initialValues: {
      room_id: "",
      room_name: "",
      room_prize: "",
      room_type: "",
      checkin_date: "",
      checkout_date: "",
      room_img: null,
      room_status: "",
      email: "",
    },
    validationSchema: Yup.object({
      room_id: Yup.string().required("Room ID is required"),
      room_name: Yup.string().required("Room name is required"),
      room_prize: Yup.string().required("Room prize is required"),
      room_type: Yup.string().required("Room type is required"),
      checkin_date: Yup.date().required("Check-in date is required"),
      checkout_date: Yup.date().required("Check-out date is required"),
      room_img: Yup.mixed().required("Room image is required"),
      room_status: Yup.string().required("Room status is required"),
      email: Yup.string().required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("room_id", values.room_id);
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

        console.log("Form Data:", formData);

        const response = await axios.post(`http://localhost:8081/room_confirm/${id}`, formData);
        console.log("Reservation Response:", response.data);
        alert("Room reserved successfully");
        navigate("/history");
      } catch (error) {
        console.error("Error reserving room:", error);

        if (axios.isAxiosError(error) && error.response) {
          console.error("Error details:", error.response.data);
        } else {
          console.error("Error details:", (error as Error).message);
          console.error("Full error object:", error);
        }

        alert("Error reserving room. Please try again.");
      }
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/rooms_serve/${id}`);
        console.log("Response:", response.data);
        const roomData = response.data[0];

        formik.setValues({
          room_id: roomData.room_id,
          room_name: roomData.room_name,
          room_prize: roomData.room_prize,
          room_type: roomData.room_type,
          room_img: roomData.room_img,
          checkin_date: roomData.checkin_date,
          checkout_date: roomData.checkout_date,
          room_status: roomData.room_status,
          email: roomData.email,
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
        <div className="room-details-container">
          <h2 className="text-center mb-4">Room Details</h2>

          <table className="table">
            <tbody>
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
              <tr>
                <th>Room ID:</th>
                <td>{formik.values.room_id}</td>
              </tr>
              <tr>
                <th>Room Name:</th>
                <td>{formik.values.room_name}</td>
              </tr>
               <tr>
                <th>Email:</th>
                <td>{formik.values.email}</td>
              </tr>
              <tr>
                <th>Room Type:</th>
                <td>{formik.values.room_type}</td>
              </tr>
              <tr>
                <th>Check-in Date:</th>
                <td>{formik.values.checkin_date}</td>
              </tr>
              <tr>
                <th>Check-out Date:</th>
                <td>{formik.values.checkout_date}</td>
              </tr>
              <tr>
                <th>Prize:</th>
                <td>{formik.values.room_prize}</td>
              </tr>
              <tr>
                <th>Room Status:</th>
                <td>{formik.values.room_status}</td>
              </tr>
              <tr>
                <th>Confirmation:</th>
                <td>
                  <div>
                    <p>
                      By clicking "Confirmation", you agree to reserve this room under the provided details.
                      Please make sure all the information is correct before confirming.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <form onSubmit={formik.handleSubmit}>
            <button type="submit" className="btn btn-success">
              Confirm Reservation &nbsp;
              <FontAwesomeIcon icon={faServer} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProceed;

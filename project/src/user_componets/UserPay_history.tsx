// Frontend code (React)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserHistory = () => {
    const [data, setData] = useState([]);
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/pay_history?userEmail=${userEmail}`);
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [userEmail]);

    return (
        <div className="container mt-3 user-list-container">
            <h1>My Pay History</h1>
            <div className="row">
                <div className="col-sm-12">
                    <table className="table table-hover table-custom-bordered" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>User ID</th>
                                <th>Room Img</th>
                                <th>User Name</th>
                                <th>Room Name</th>
                                <th>Room Type</th>
                                <th>Checkin Date</th>
                                <th>Checkout Date</th>
                                <th>Total Price</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((room, key) => (
                                <tr key={key}>
                                    <td>{room["room_id"]}</td>
                                    <td>{room["user_id"]}</td>
                                    <td>
                                        {room["room_img"] && (
                                            <img
                                                src={`http://localhost:8081/images/${room["room_img"]}`}
                                                alt={`Room ${room["id"]} Image`}
                                                style={{ width: "95px", height: "90px" }}
                                            />
                                        )}
                                    </td>
                                    <td>{room["user_name"]}</td>
                                    <td>{room["room_name"]}</td>
                                    <td>{room["room_type"]}</td>
                                    <td>{room["date_checkin"]}</td>
                                    <td>{room["date_checkout"]}</td>
                                    <td>{room["total_price"]}</td>
                                    <td style={{ color: room["payment_status"] === "pending" ? 'red' : 'green' }}>
                                        {room["payment_status"]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserHistory;

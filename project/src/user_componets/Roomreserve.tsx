import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusCircle, faEye, faBed, faBook, faMoneyBillAlt, faEdit, faServer } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/room.css';
const Roomreserve = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/rooms")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, []);

        return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12" style={{ paddingRight: '20%' }}>
                    <h1>Room Reservation</h1>
                    <div className="row">
                        {data.map((room, key) => (
                            <div key={key} className="col-md-6 mb-3">
                                <div className="room-box" style={{ backgroundColor: '#000', color: '#fff', width: '100%', margin: '1px', paddingBottom: '10px', paddingRight: '5%', paddingLeft: '2%', transition: 'transform 0.3s ease-in-out', paddingTop: '1%'}}>
                                    {room["room_img"] && (
                                        <img
                                            src={`http://localhost:8081/images/${room["room_img"]}`}
                                            alt={`Room ${room["id"]} Image`}
                                            style={{ width: "70%", height: "120px", margin: '10px' }}
                                            className="mx-auto d-block" // Center the image
                                        />
                                    )}
                                    <p>ID: {room["id"]}</p>
                                    <p>Room Name: {room["room_name"]}</p>
                                    <p>Room Type: {room["room_type"]}</p>
                                    <p>Room Prize: {room["room_prize"]}</p>
                                    <p>Room Status: {room["room_status"]}</p>

                                    <div className="action-buttons">
                                        <Link
                                            className="btn btn-warning btn-sm mr-2"
                                            to={`/rent/${room["id"]}`}
                                        >
                                            <FontAwesomeIcon icon={faServer} />
                                            &nbsp;Serve
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roomreserve;
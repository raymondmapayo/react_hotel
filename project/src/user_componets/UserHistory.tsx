    // Frontend code (React)
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faTrash, faPencil, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
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
                    const response = await fetch(`http://localhost:8081/user_confirm?userEmail=${userEmail}`);
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }, [userEmail]);


        return (
            <div className="container mt-3 user-list-container">
                <h1>ROOM CONFIRMATION</h1>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-hover table-custom-bordered" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Room ID</th>
                                     <th>Room Img</th>
                                    <th>Email </th>
                                    <th>Room Name</th>
                                    <th>Room Type</th>
                                    <th>Checkin Date </th>
                                    <th>Checkout Date</th>
                                    <th>Total Price</th>
                                    <th>Room Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((room, key) => (
                                    <tr key={key}>
                                        <td>{room["id"]}</td>
                                        <td>{room["room_id"]}</td>
                                         <td>
                                            {room["room_img"] && (
                                                <img
                                                    src={`http://localhost:8081/images/${room["room_img"]}`}
                                                    alt={`Room ${room["id"]} Image`}
                                                    style={{ width: "50px", height: "50px" }}
                                                />
                                            )}
                                        </td> 
                                        <td>{room["email"]}</td>
                                        <td>{room["room_name"]}</td>
                                        <td>{room["room_type"]}</td>
                                        <td>{room["checkin_date"]}</td>
                                        <td>{room["checkout_date"]}</td>
                                        <td>{room["room_prize"]}</td>
                                        <td>{room["room_status"]}</td>
                                        <td>
                                            &nbsp;
                                            <Link
                                                className="btn btn-success btn-sm"
                                                to={`/payment/${room["room_id"]}`}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                Payment
                                            </Link>
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

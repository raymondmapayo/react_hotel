    // Frontend code (React)
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faTrash, faPencil, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
    import { Link } from "react-router-dom";
    import axios from "axios";
    import { useState, useEffect } from "react";
    import 'bootstrap/dist/css/bootstrap.min.css';

    const UserReservation = () => {
        const [data, setData] = useState([]);
        const userEmail = localStorage.getItem("userEmail");

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8081/user_serve?userEmail=${userEmail}`);
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }, [userEmail]);

     const handleDeleteItem = (id: string) => {
      
        const confirmDelete = window.confirm("Are you sure you want to cancel this reservation?");

        if (confirmDelete) {
            // If user confirms, proceed with the deletion
            axios.delete(`http://localhost:8081/roomserve/${id}`)
                .then((response) => {
                    alert("Reservation cancelled successfully!");
                    console.log("Delete successful:", response.data);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                });
        }
    };

        return (
            <div className="container mt-3 user-list-container">
                <h1> Reservation</h1>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-hover table-custom-bordered" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Room ID</th>
                                    <th>Email </th>
                                    <th>Room Name</th>
                                    <th>Room Type</th>
                                    <th>Checkin Date </th>
                                    <th>Checkout Date</th>
                                    <th>Room Prize</th>
                                    <th>Room Img</th>
                                    <th>Room Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((room, key) => (
                                    <tr key={key}>
                                        <td>{room["id"]}</td>
                                        <td>{room["room_id"]}</td>
                                        <td>{room["email"]}</td>
                                        <td>{room["room_name"]}</td>
                                        <td>{room["room_type"]}</td>
                                        <td>{room["checkin_date"]}</td>
                                        <td>{room["checkout_date"]}</td>
                                        <td>{room["room_prize"]}</td>
                                        <td>
                                            {room["room_img"] && (
                                                <img
                                                    src={`http://localhost:8081/images/${room["room_img"]}`}
                                                    alt={`Room ${room["id"]} Image`}
                                                    style={{ width: "50px", height: "50px" }}
                                                />
                                            )}
                                        </td>
                                        <td>{room["room_status"]}</td>
                                        <td>
                                        <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteItem(room["room_id"])}
                                            >
                                                <FontAwesomeIcon icon={faTimes} /> 
                                                &nbsp;Cancel
                                            </button>
                                            &nbsp;
                                            <Link
                                                className="btn btn-success btn-sm"
                                                to={`/proceed/${room["room_id"]}`}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                Proceed
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

    export default UserReservation;

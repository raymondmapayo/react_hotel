import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Room = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8081/rooms")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, []);

    function handleDeleteItem(id: string) {
        axios.delete(`http://localhost:8081/rooms/${id}`).then((response) => {
            console.log("response:" + response.data);
            window.location.reload();
        });
    }

    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Add Rooms</h1>
                    <Link className="btn btn-success btn-sm mb-3" to="/addrooms">
                        Add Rooms &nbsp;
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </Link>
                    <table className="table table-hover table-custom-bordered" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Room Name</th>
                                <th>Room Prize</th>
                                <th>Room Type</th>
                                <th>Room Image</th>
                                <th>Room Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((room, key) => (
                                <tr key={key}>
                                    <td>{room["id"]}</td>
                                    <td>{room["room_name"]}</td>
                                    <td>{room["room_prize"]}</td>
                                    <td>{room["room_type"]}</td>
                                    <td>
                                        {room["room_img"] && (
                                            <img
                                                src={`http://localhost:8081/images/${room["room_img"]}`}
                                                alt={`Room ${room["id"]} Image`}
                                                style={{ width: "100%", height: "100px" }}
                                            />
                                        )}
                                    </td>
                                    <td>{room["room_status"]}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteItem(room["id"])}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            &nbsp;Delete
                                        </button>
                                         &nbsp;
                                                    <Link
                                className="btn btn-warning btn-sm"
                                to={`/rooms/${room["id"]}/edit`}
                                >
                                <FontAwesomeIcon icon={faPencil} />
                                Edit
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

export default Room;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,
faPencil,
faPlusCircle,
faComments
 } from "@fortawesome/free-solid-svg-icons";
 import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';




const UserList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/user")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

function handleDeleteItem(id: string) {
    axios.delete(`http://localhost:8081/user/${id}`).then((response) => {
        console.log("response:" + response.data);
        window.location.reload();
    });
}

  return (
    <div className="container mt-3 user-list-container">
      <div className="row">
        <div className="col-sm-12">
          <h1>User List</h1>
           
          <table className="table table-hover table-custom-bordered " style={{width: '100%'}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                 <th>Gender</th>
                  <th>Status</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data, key) => (
                <tr key={key}>
                  <td>{data["id"]}</td>
                  <td>{data["name"]}</td>
                  <td>{data["email"]}</td>
                  <td>{data["gender"]}</td>
                  <td>{data["status"]}</td>
                  <td>{data["phone"]}</td>
                  <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteItem(data["id"])}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        &nbsp;Delete
                      </button>
                      &nbsp;
                      <Link
                        className="btn btn-warning btn-sm"
                        to={`/edit/${data["id"]}`}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                        Edit
                      </Link>
                       &nbsp;
                       <Link
                        className="btn btn-success btn-sm"
                        to={`/adminauth/${data["id"]}`}
                      >
                        <FontAwesomeIcon icon={faComments} />
                        Chat
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

export default UserList;

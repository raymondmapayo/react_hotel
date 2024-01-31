import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientHistory = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/client_history');
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateItem = async (roomId: string) => {
        try {
            const confirmUpdate = window.confirm('Are you sure you want to update the payment status to "paid"?');

            if (!confirmUpdate) {
                return;
            }

            const response = await axios.put('http://localhost:8081/update_payment_status', {
                room_id: roomId,
                new_status: 'paid'
            });

            if (response.data.success) {
                console.log('Payment status updated successfully');
                 // Reload the window after successful update
                window.location.reload();
            } else {
                console.error('Failed to update payment status:', response.data.error);
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

     return (
        <div className="container mt-3 user-list-container">
            <h1>User Pay History</h1>
            <div className="row">
                <div className="col-sm-12">
                    <table className="table table-hover table-custom-bordered" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>User ID</th>
                                <th>Checkin Date</th>
                                <th>Checkout Date</th>
                                <th>Total Price</th>
                                <th>Payment Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((payment, key) => (
                                <tr key={key}>
                                    <td>{payment["room_id"]}</td>
                                    <td>{payment["user_id"]}</td>
                                    <td>{payment["date_checkin"]}</td>
                                    <td>{payment["date_checkout"]}</td>
                                    <td>{payment["total_price"]}</td>
                                    <td style={{ color: payment["payment_status"] === "pending" ? 'red' : 'green' }}>
                                        {payment["payment_status"]}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleUpdateItem(payment["room_id"])}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                            &nbsp;Update
                                        </button>
                                        &nbsp;
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

export default ClientHistory;
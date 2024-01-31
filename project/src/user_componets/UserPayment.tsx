import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/roomcheckout/${id}`);
        const roomData = response.data[0];
        console.log('Room Data:', roomData);
        setRoomData(roomData);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id]);

  const handleCheckoutItem = async () => {
    const isConfirmed = window.confirm("Are you sure you want to checkout?");
    if (!isConfirmed) {
      console.log('Checkout canceled.');
      return;
    }

    try {
      if (!roomData) {
        console.error('Room data is null. Cannot proceed with checkout.');
        // Add logic to handle this case, such as displaying an error message to the user
        return;
      }

      console.log('Sending checkout request...');
      await axios.post(`http://localhost:8081/checkout/${id}?userEmail=${userEmail}`);

      // Navigate to the success page after successful checkout
      navigate('/reserve');
    } catch (error) {
      console.error("Error checking out room:", error);
      // Add logic to handle the error, such as displaying an error message to the user
    }
  };
const handlePayWithCard = async (room_id: string, totalPrice: string, id: string) => {
        try {
            const response = await axios.post("http://localhost:3000/create-checkout-session", {
                items: [{ id: room_id, quantity: 1 }],
                totalprice: totalPrice,
            });

            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error initiating payment:", error);
        }
    };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto mt-6" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">CheckOut Room</h2>
        {roomData && (
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h5 className="card-title">Room Information</h5>
              <img
                src={`http://localhost:8081/images/${roomData["room_img"]}`}
                alt={`Room ${roomData["id"]} Image`}
                style={{ width: "290px", height: "200px" }}
              />
              <p><strong>Room ID:</strong> {roomData['room_id']}</p>
              <p><strong>Room Name:</strong> {roomData['room_name']}</p>
              <p><strong>Email:</strong> {roomData['email']}</p>
              <p><strong>Room Type:</strong> {roomData['room_type']}</p>
              <p><strong>Check-in Date:</strong> {roomData['checkin_date']}</p>
              <p><strong>Check-out Date:</strong> {roomData['checkout_date']}</p>
              <p><strong>Room Prize:</strong> {roomData['room_prize']}</p>
              <p><strong>Room Status:</strong> {roomData['room_status']}</p>
            </div>

            <div className="card-body">
              <h5 className="card-title">Confirmation</h5>
              <div>
                <p>
                  By clicking "Checkout," you agree to check out this room under the provided details.
                  Please make sure all the information is correct before confirming.
                </p>
              </div>
            </div>
          </div>
      )}
        {roomData ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCheckoutItem}

            >
              CHECKOUT
            </button>
          <button className="btn btn-primary btn-sm"
          onClick={() => {handlePayWithCard(roomData['room_id'], roomData['room_prize'], roomData['id']);
         handleCheckoutItem
        
        }}

          >
            Pay Card
          </button>
          </div>
        
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserPayment;

import io from 'socket.io-client';
import { useState, useEffect } from "react";
import Chat from "./Chat";
import "./Chatstyle.css";

const socket = io("http://localhost:3001");

const Auth = () => {
    const [userID, setUserID] = useState(0);
    const [userName, setUserName] = useState("");
    const userEmail = localStorage.getItem("userEmail");
    // Remove room state as it's no longer needed
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/authuser?userEmail=${userEmail}`);
                const userData = await response.json();
                if (userData.length > 0) {
                    setUserID(userData[0].id);
                } else {
                    console.error('Unexpected data structure for authuser:', userData);
                }
                const nameresponse = await fetch(`http://localhost:8081/authusername?userEmail=${userEmail}`);
                const namedata = await nameresponse.json();
                if (namedata.length > 0) {
                    setUserName(namedata[0].name);
                } else {
                    console.error('Unexpected data structure for totalincome:', namedata);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userEmail]);

    const joinRoom = () => {
        if (userName !== "") {
            // Use userID directly for room without the need for an input field
            const userRoom = userID.toString();
            socket.emit("join_room", userRoom);
            setShowChat(true);
        }
    };

    return (
        <div className="App">
            {!showChat ? (
                <div className="joinChatContainer">
                    <h3 style={{ color: 'white' }}>Chat Support</h3>
                    <input
                        type="text"
                        placeholder="John..."
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                    {/* Remove the room input field */}
                    <button onClick={joinRoom}>Chat</button>
                </div>
            ) : (
                <Chat socket={socket} username={userName} room={userID.toString()} />
            )}
        </div>
    );
}

export default Auth;
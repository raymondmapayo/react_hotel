import io from 'socket.io-client';
import { useState } from "react";
import Chat from "./Chat";
import "./Chatstyle.css";
import { useParams } from 'react-router-dom';

const socket = io("http://localhost:3001");

function AdminAuth() {
    const { id = "" } = useParams(); // Provide a default value for id

    const [username, setUsername] = useState("");
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username === "") {
            // Emit id directly without converting to a number
            socket.emit("join_room", id);
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
                        placeholder="Name / Email"
                        value={'Admin'}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <button onClick={joinRoom}>Chat Customer</button>
                </div>
            ) : (
                <Chat socket={socket} username={username} room={id} />
            )}
        </div>
    );
}

export default AdminAuth;
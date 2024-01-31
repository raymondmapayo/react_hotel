import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import "./Chatstyle.css";

interface Message {
    room: string;
    author: string;
    message: string;
    time: string;
}

interface SocketProps {
    socket: Socket;
    username: string;
    room: string;
}

function Chat({ socket, username, room }: SocketProps) {
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageList, setMessageList] = useState<Array<Message>>([]);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            console.log("Message sent: " + messageData);
            setCurrentMessage("");
        }
    };

    // Handle receiving initial set of messages when joining a room
    const handleReceiveMessages = (messages: Message[]) => {
        setMessageList(messages);
        console.log("Initial messages received:", messages);
    };

    useEffect(() => {
        // Listen for incoming messages
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            console.log("Message received: " + data);
        });

        // Listen for initial set of messages when joining a room
        socket.on("receive_messages", handleReceiveMessages);

        // Scroll to the bottom of the message container when messageList changes
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }

        // Clean up listeners when the component unmounts
        return () => {
            socket.off("receive_message");
            socket.off("receive_messages", handleReceiveMessages);
        };
    }, [socket, messageList]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <div className="message-container" ref={messageContainerRef}>
                    {messageList.map((messageContent, key) => {
                        return (
                            <div
                                key={key}
                                className="message"
                                id={username === messageContent.author ? "you" : "other"}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage} style={{ color: 'blue', background: 'lightgray' }}>
                    &#9658;
                </button>
            </div>
        </div>
    );
}

export default Chat;
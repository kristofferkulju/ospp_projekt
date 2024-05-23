import React, { useRef, useEffect, useState } from 'react';
import './Chat.css'

function Chat({socket, username, room, setIsTextFieldFocused}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList , setMessageList] = useState([{room: room, author: "Server", message: "Welcome to the chat. Remember to be respectful!"}]);
    const chatBodyRef = useRef(null);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
            };
            setMessageList((list) => [...list, messageData]);
            await socket.emit("send_message", messageData);
        }
        setCurrentMessage("");
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        return () => socket.off("receive_message");
    }, [socket]);
    
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    };

    const handleFocus = () => {
      setIsTextFieldFocused(true);
    };

    const handleUnfocus = () => {
      setIsTextFieldFocused(false);
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messageList]);

    return (
        <div className="chat-container">
            <div className="chat-window" ref={chatBodyRef}>
                {messageList.map((messageContent, index) => (
                    <div 
                        key={index} 
                        className={`message`}>
                        <div className={`sender ${
                            messageContent.author === username ? 'me-sender' 
                            : messageContent.author === 'Server' ? 'server-sender' 
                            : ''
                        }`}>{messageContent.author}</div>
                        <div className="text">{messageContent.message}</div>
                    </div>
                ))}
            </div>

            <div className="chat-footer">
                <input
                    className="chat-input"
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleUnfocus}
                    type="text"
                    placeholder="Hey.."
                    value={currentMessage}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }} 
                />
                <button className="send" onClick={sendMessage}> &#9658;</button>
            </div>
        </div>
    )
}
export default Chat;
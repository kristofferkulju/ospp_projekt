import React from 'react';
import { useState } from "react";
import { useEffect } from "react";

function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList , setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,

            };
        
        await socket.emit("send_message", messageData);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [socket]);

    return (
        <div className="chat-window"> 
            <div className= "chat-header"> 
                <p>Live Chat</p>
            </div>
            <div className= "chat-body"> 
                {messageList.map((messageContent) => {
                    return <h1>{messageContent.message}</h1>
                })}
            </div>
            <div className= "chat-footer ">
                <input 
                type="text" 
                placeholder ="Hey.." 
                onChange={(event) => {
                    setCurrentMessage(event.target.value)
                }}/>
                <button onClick = {sendMessage}> &#9658;</button>
                 </div>
        </div>
    )
}

export default Chat;
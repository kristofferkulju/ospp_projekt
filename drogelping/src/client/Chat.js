import React, { useRef } from 'react';
import { useState } from "react";
import { useEffect } from "react";

function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList , setMessageList] = useState([{room: room, author: "Server", message: "ASL"}]);
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
    
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messageList]);

    return (
        <div>
        <div className= "chat-header"> 
            <p>Live Chat</p>
        </div>
        <div className="chat-window" ref={chatBodyRef}> 
            <div className= "chat-body"> 
                {messageList.map((messageContent) => {
                    return <p><b>{messageContent.author}</b> : {messageContent.message}</p>
                })}
            </div>
        </div>
        
        <div className= "chat-footer ">
            <input 
            onKeyDown={(event) => { 
                if (event.key === "Enter") { 
                    sendMessage();
                } 
            }} 
            type="text" 
            placeholder ="Hey.." 
            value={currentMessage}
            onChange={(event) => {
                setCurrentMessage(event.target.value);
            }}/>
            <button onClick = {sendMessage}> &#9658;</button>
        </div>
        </div>
    )
}

export default Chat;
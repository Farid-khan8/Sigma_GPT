import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";

import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currentThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); //default false

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currentThreadId,
            }),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    //append new chats to previous chat
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "assistant",
                    content: reply,
                },
            ]);
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>
                    SigmaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>
            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-circle-up"></i>Upgrade Plan
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>Settings
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                        Log Out
                    </div>
                </div>
            )}

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
                    ></input>
                    <div onClick={getReply} id="submit">
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie
                    Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;

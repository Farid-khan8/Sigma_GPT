import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currentThreadId, setCurrentThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]); //store all chats of curr threads
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    const providerValue = {
        prompt,
        setPrompt,
        reply,
        setReply,
        currentThreadId,
        setCurrentThreadId,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
        allThreads,
        setAllThreads,
    }; //passing values
    return (
        <div className="app">
            <MyContext.Provider value={providerValue}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default App;

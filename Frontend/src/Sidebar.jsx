import React from "react";
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currentThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrentThreadId,
        setPrevChats,
    } = useContext(MyContext);

    const getAllThread = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filterData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));
            // console.log(filterData);
            //we need only theadId & title
            setAllThreads(filterData);
        } catch (err) {
            console.log(err);
        }
    };

    //
    useEffect(() => {
        getAllThread();
    }, [currentThreadId]);

    //
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrentThreadId(uuidv1());
        setPrevChats([]);
    };

    //
    const changeThread = async (newThreadId) => {
        setCurrentThreadId(newThreadId);

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadId}`
            );
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    //
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                { method: "DELETE" }
            );
            const res = await response.json();
            console.log(res);

            //re-render updated threads after deletion
            setAllThreads((prev) =>
                prev.filter((thread) => thread.threadId !== threadId)
            );

            if (threadId === currentThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img
                    src="src/assets/blacklogo.png"
                    alt="logo"
                    className="logo"
                />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            {/* history */}

            <ul className="history">
                {allThreads.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={(e) => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currentThreadId
                                ? "highlighted"
                                : " "
                        }
                    >
                        {thread.title}
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation(); //stop event bubbling
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* sign */}

            <div className="sign">
                <p>By Farid &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;

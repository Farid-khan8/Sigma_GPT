import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
//React-Markdown & rehype-highlight npm package

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null); //loading previous chat
            return;
        }

        //latest reply will seperate=> creating typing effect
        if (!prevChats?.length) return;

        const content = reply.split(" "); //individual word

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {newChat && <h2>Start a new Chat!</h2>}
            <div className="chats">
                {prevChats?.slice(0, -1).map((chat, idx) => {
                    return (
                        <div
                            className={
                                chat.role === "user" ? "userDiv" : "gptDiv"
                            }
                            key={idx}
                        >
                            {chat.role === "user" ? (
                                <p className="userMessage">{chat.content}</p>
                            ) : (
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {chat.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    );
                })}

                {/* //using ternary operator */}
                {prevChats.length > 0 && (
                    <>
                        {latestReply === null ? (
                            <div className="gptDiv" key={"non-typing"}>
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {prevChats[prevChats.length - 1].content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="gptDiv" key={prevChats.length}>
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {latestReply}
                                </ReactMarkdown>
                            </div>
                        )}
                    </>
                )}
                {/*  */}
                {/*  */}

                {/* {prevChats.length > 0 && latestReply !== null && (
                    <div className="gptDiv" key={prevChats.length}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestReply}
                        </ReactMarkdown>
                    </div>
                )}
                {prevChats.length > 0 && latestReply === null && (
                    <div className="gptDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {prevChats[prevChats.length - 1].content}
                        </ReactMarkdown>
                    </div>
                )} */}
            </div>

            {/* //Static data */}
            {/* <div className="chats">
                <div className="userDiv">
                    <p className="userMessage">User Chats</p>
                </div>
                <div className="gptDiv">
                    <p className="gptMessage">GPT Generated Chats</p>
                </div>
            </div> */}
        </>
    );
}

export default Chat;

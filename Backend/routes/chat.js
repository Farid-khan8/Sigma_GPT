import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getOpenAiApiResponse from "../utils/openai.js";

//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "new test thread-2",
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //descending order of updateAt---most recent on top
        res.send(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//Get Particular thread Chat
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

//Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deleteThread = await Thread.findOneAndDelete({ threadId });

        if (!deleteThread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});
export default router;

//New chat thread
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            //create a new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            //add user message to existing thread
            thread.messages.push({ role: "user", content: message });
        }
        //get OpenAI API response
        const assistantReply = await getOpenAiApiResponse(message);

        //add assistant response
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        //save updated thread
        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

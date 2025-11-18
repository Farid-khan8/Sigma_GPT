import "dotenv/config";

const getOpenAiApiResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        }),
    };
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );
        const data = await response.json();
        const reply = data.choices[0].message.content; //reply
        return reply;
    } catch (e) {
        console.log(e);
    }
};

export default getOpenAiApiResponse;

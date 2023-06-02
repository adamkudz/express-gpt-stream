import express from "express";
import { Configuration, OpenAIApi } from "openai";
import { pipeline } from "node:stream/promises";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json()); // for the body of the request

const configuration = new Configuration({
    organization: "org-o3G5e4ziOaVOXVDnPgu5iFOc",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/chatapi", async (req, res) => {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                //we need to send the body as a string, so we use JSON.stringify.
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            // The message will be 'Say hello.' unless you provide a message in the request body.
                            content: ` ${req.body.message || "Say hello."}`,
                        },
                    ],
                    temperature: 0,
                    max_tokens: 25,
                    n: 1,
                    stream: true,
                }),
            }
        );

        await pipeline(response.body, res);
    } catch (err) {
        console.log(err);
    }
});
app.post("/chatwithpackage", async (req, res) => {
    try {
        const response = await openai.createChatCompletion(
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        // The message will be 'Say hello.' unless you provide a message in the request body.
                        content: ` ${req.body.message || "Say hello."}`,
                    },
                ],
                temperature: 0,
                max_tokens: 25,
                n: 1,
                stream: true,
            },
            { responseType: "stream" }
        );
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

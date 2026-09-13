// https://openrouter.ai/workspaces/default/keys/90f9ee58364fa511648e9cd76f09bcdc8f8abd2d7db972bd799d8f2dfd405a26
import OpenAI from "openai";
import express from 'express'


const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: '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',
});


const app = express();

app.use(express.json());



let messages = [];

async function test(question) {
    try {

        // 1. Store user's question
        messages.push({
            role: "user",
            content: question
        });

        // 2. Send complete conversation to AI
        const response = await client.chat.completions.create({
            model: "openai/gpt-4o",
           max_tokens: 300, // Safe limit for short answers
            temperature: 0,
            messages: messages
        });

        // 3. Get AI answer
        const answer = response.choices[0].message.content;

        // 4. Store AI answer
        messages.push({
            role: "assistant",
            content: answer
        });

        console.log("AI:", answer);

        console.log(
            "Input tokens:",
            response.usage.prompt_tokens
        );

        console.log(
            "Output tokens:",
            response.usage.completion_tokens
        );

        console.log(
            "Total tokens:",
            response.usage.total_tokens
        );

        // 5. Return answer to route
        return answer;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

app.get("/home", async (req, res) => {
    try {

        const { question } = req.query;

        const main = await test(question);

        res.send(main);

    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});


const port=9000

app.listen(port , ()=>{
    console.log(port)
})
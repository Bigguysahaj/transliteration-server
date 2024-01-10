import express from 'express';
import {MessageRequest} from '../interfaces/MessageResponse';
import OpenAI from "openai";

const router = express.Router();

require('dotenv').config();

router.post<{}, MessageRequest>("/hindi", async (req, res) => {
        console.log(req.body);
        const message = req.body.message;
        try {
            console.log(message);
            const response = await GPT3(message);
            console.log(response);
            res.json({ output: response || undefined });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
  
  if (process.env.OPENAI_API_KEY === "") {
    console.error(`You haven't set up your API key yet.`);
    process.exit(1);
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  let GPT3 = async (message: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
  
      messages: [
        {
          role: "system",
          content:
            "You are a language model designed to assist with Hindi to Hinglish conversion and transliteration. Please provide accurate and natural-sounding translations. If the input contains pure Hindi words, transliterate them appropriately. Preserve the array format at any case",
        },
        { role: "user", content: message },
      ],
    });
    return response.choices[0].message.content;
  };

export default router;
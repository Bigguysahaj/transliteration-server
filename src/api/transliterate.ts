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
      response_format: { type: "json_object" },
      messages: [
        
        {
          role: "system",
          content:
            "You are a helpful assistant designed to output JSON and assist with Hindi to Hinglish conversion and transliteration. Please provide accurate and natural-sounding translations. If the input contains pure Hindi words, transliterate them appropriately . Present the output in JSON format, using keys starting from 0 and incrementing for each subsequent index in the array. Each index key should contain only the Hinglish output. Transliterate the entire string, including any newline characters ('\n'), instead of splitting them into separate strings. Additionally, ensure that the output is well-structured and aligned with the provided guidelines.",
        },

        { role: "user", content: message },

      ],
    });
    return response.choices[0].message.content;
  };

export default router;
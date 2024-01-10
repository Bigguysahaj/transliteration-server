import OpenAI from "openai";
import express from "express";
import morgan from 'morgan';
import bodyParser from "body-parser";
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
// import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: 'https://www.netflix.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Current Transliteration capabilities is Devnagri Hindi to Roman Hindi script 🌍 ',
  });
});

app.post<{}, MessageResponse>("/openai", async (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  try {
    console.log(message);
    const response = await GPT3(message);
    console.log(response);
    res.json({ output: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://www.netflix.com");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE",
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200); // Respond with OK status for preflight requests
// });

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://www.netflix.com");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE",
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

// app.use(bodyParser.json());

if (process.env.OPENAI_API_KEY === "") {
  console.error(`You haven't set up your API key yet.

If you don't have an API key yet, visit:

https://platform.openai.com/signup

1. Make an account or sign in
2. Click "View API Keys" from the top right menu.
3. Click "Create new secret key"

Then, open the Secrets Tool and add OPENAI_API_KEY as a secret.`);
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let GPT3 = async (message: string) => {
  console.time("api-response-gpt3");
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
  console.timeEnd("api-response-gpt3");
  console.log("yayyy");
  return response.choices[0].message.content;
};

app.post("/openai", async (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  try {
    console.log(message);
    const response = await GPT3(message);
    console.log(response);
    res.json({ output: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const GPT4Message = [
//   { role: "system", content: "Transliterate the following text from devanagri to roman script, and preserve the array format" },
//   { role: "user", content: "Who won the world series in 2020?" }
// ];
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import {MessageResponse, MessageRequest} from './interfaces/MessageResponse';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: 'https://www.netflix.com',
    methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
    exposedHeaders: ['Content-Type'], 
    credentials: true
  })
);

app.options("*", cors());

app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Current version 2 Transliteration capabilities is Devnagri Hindi to Roman Hindi script 🌍 ',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;

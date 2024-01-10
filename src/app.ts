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

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;

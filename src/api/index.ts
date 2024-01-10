import express from 'express';

import {MessageResponse , MessageRequest} from '../interfaces/MessageResponse';
// import emojis from './emojis';
import transliterate from './transliterate';

const router = express.Router();

// router.get<{}, MessageResponse>('/', (req, res) => {
//   res.json({
//     message: 'API - 👋🌎🌍🌏',
//   });
// });

// router.use('/emojis', emojis);
router.use('/transliterate', transliterate);

export default router;

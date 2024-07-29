import express from 'express';

const router = express.Router();

router.use('/', require('./products').default);

export default router;
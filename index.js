import express from 'express';

const app = express();

const port = 3000;

const routes = require('./routes').default;

app.use('/get', routes);

export default app;
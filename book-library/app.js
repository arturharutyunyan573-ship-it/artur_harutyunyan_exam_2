import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { createServer } from 'http';

import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;


app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(router);

app.use(errorHandler.notFound);

app.use(errorHandler.errors);

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
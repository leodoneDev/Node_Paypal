import express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import paypalController from './controllers/paypal';
import pagesController from './controllers/pages';
import log from './services/logger';

const app = express();
dotenv.config();

app
  .use(express.json())
  .use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400, stream: process.stderr,
  }))
  .use(morgan('combined', {
    skip: (req, res) => res.statusCode >= 400, stream: process.stdout,
  }))
  .use('/', express.static(path.join(__dirname, '../public')))
  .use('/', paypalController)
  .use('/', pagesController);

app.listen(process.env.PORT || 3000, () => {
  log.info(`App listening on port ${process.env.PORT || 3000}`);
});

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import paypalController from './controllers/paypal';
import pagesController from './controllers/pages';

const app = express();
dotenv.config();

const interceptRequest = (req, res, next) => {
  const meta = {
    host: req.get('host'),
    path: req.path,
    query: req.query,
    body: req.body,
  };

  console.log('Incoming request', JSON.stringify(meta, null, 2));
  next();
};

app
  .use(express.json())
  .use(interceptRequest)
  .use('/', express.static(path.join(__dirname, '../public')))
  .use('/', paypalController)
  .use('/', pagesController);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app listening on port ${process.env.PORT || 3000}`);
});

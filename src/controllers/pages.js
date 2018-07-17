import express from 'express';

const router = new express.Router();

router.get('/', (req, res) => {
  res.redirect('/index.html');
});

export default router;

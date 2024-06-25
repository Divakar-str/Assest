const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;

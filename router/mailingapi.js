const express = require('express');
const control = require('../controller/mailing');

const router = express.Router();

router.get('/mailing',control.mailing);

module.exports = router;
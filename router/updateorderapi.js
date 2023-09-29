const express = require('express');
const control = require('../controller/updateOrder');

const router = express.Router();

router.put('/updateOrder',control.validateOrder,control.updateOrder);

module.exports = router;
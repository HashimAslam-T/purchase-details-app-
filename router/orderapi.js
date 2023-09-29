const express = require('express');
const control = require("../controller/order");

const router = express.Router();

router.post("/placeOrder",control.validateOrder,control.placeOrder);

module.exports = router;



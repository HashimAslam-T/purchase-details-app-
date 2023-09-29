const express = require('express');
const control = require("../controller/product");

const router = express.Router();

router.post("/addproduct",control.validateProduct,control.postProduct);

module.exports = router;



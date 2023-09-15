const express = require('express');
const control = require("../controller/product");

const router = express.Router();

router.post("/addproduct",control.postProduct);

module.exports = router;



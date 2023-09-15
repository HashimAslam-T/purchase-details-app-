const express = require('express');
const control = require("../controller/fetching");

const router = express.Router();

router.get("/fetchDetails",control.getDetails);

module.exports = router;



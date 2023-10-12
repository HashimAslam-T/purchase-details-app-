const express = require('express');
const multer  = require('multer');
const control = require("../controller/excelToJson");

const upload = multer({ dest: 'uploads/' });


const router = express.Router();

router.post('/upload', upload.single('file'),control.toJson)

module.exports = router;



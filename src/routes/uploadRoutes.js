const express = require("express");
const multer = require("multer");
const { uploadCSV } = require("../controllers/uploadController");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("file"), uploadCSV); //nice to have upload to S3
module.exports = router;

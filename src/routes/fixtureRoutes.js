const express = require("express");
const { searchFixtures } = require("../controllers/fixtureController");
const router = express.Router();

router.get("/search", searchFixtures);
module.exports = router;

// api: /identify
const { getData } = require("../controller/contact.controller");
const express = require("express");

const router = express.Router();

router.post("/", getData);

module.exports = router;

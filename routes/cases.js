const express = require("express");
const router = express.Router();

const Case = require("../models/case");

// Get all cases
router.get("/", async (req, res) => {
	const cases = await Case.find();
	return cases;
});

module.exports = router;

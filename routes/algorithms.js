const _ = require("lodash");
const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const Algorithm = require("../models/algorithm");

// Get all
router.get("/", async (req, res) => {
	const algorithms = await Algorithm.find();
	res.send(algorithms);
});

// Get one
router.get("/:id", async (req, res) => {
	const algorithms = await Algorithm.findById(req.params.id);
	if (!algorithms) return res.status(404).send("Algorithm not found.");
	res.send(algorithms);
});

// Create new
router.post("/", validate(Algorithm.validate), async (req, res) => {
	let algorithm = new Algorithm(req.body);
	if (algorithm) return res.status(400).send("Algorithm exists.");

	algorithm = await algorithm.save();
	res.send(algorithm);
});

// Update
router.put("/:id", validate(Algorithm.validate), async (req, res) => {
	const algorithm = await Algorithm.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);
	if (!algorithm) return res.status(404).send("Algorithm not found.");
	res.send(algorithm);
});

// Delete
router.delete("/:id", async (req, res) => {
	const algorithm = await Algorithm.findByIdAndRemove(req.params.id);
	if (!algorithm) return res.status(404).send("Algorithm not found.");
	res.send(algorithm);
});

module.exports = router;

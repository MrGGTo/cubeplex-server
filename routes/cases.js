const _ = require("lodash");
const express = require("express");
const router = express.Router();

const Case = require("../models/case");
const validate = require("../middleware/validate");

// Get all cases
router.get("/", async (req, res) => {
	const cases = await Case.find();
	res.send(cases);
});

// Create new case
router.post("/", validate(Case.validate), async (req, res) => {
	let newCase = await Case.findOne({ name: req.body.name });
	if (newCase) return res.status(400).send("Case already exists.");

	newCase = new Case(_.pick(req.body, ["name", "type"]));
	newCase = await newCase.save();

	res.send(newCase);
});

router.put("/:id", validate(Case.validate), async (req, res) => {
	const updatedCase = await Case.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["name", "type"]),
		{ new: true }
	);
	if (!updatedCase) return res.status(404).send("Case not found.");

	res.send(updatedCase);
});

router.delete("/:id", async (req, res) => {
	const deletedCase = await Case.findByIdAndRemove(req.params.id);
	if (!deletedCase) return res.status(404).send("Case not found.");
	res.send(deletedCase);
});

module.exports = router;

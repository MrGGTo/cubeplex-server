const _ = require("lodash");
const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const Algorithm = require("../models/algorithm");
const AlgorithmRating = require("../models/algorithmRating");

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
	let algorithm = await Algorithm.findOne({ alg: req.body.alg });
	if (algorithm) return res.status(400).send("Algorithm exists.");

	algorithm = new Algorithm(req.body);

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

// Rate Algorithm
router.put(
	"/:id/rate",
	[validate(Algorithm.validateRate), auth],
	async (req, res) => {
		let algorithm = await Algorithm.findById(req.params.id);
		if (!algorithm) return res.status(404).send("Algorithm not found.");

		let rating = await AlgorithmRating.findOne({
			user: req.user._id,
			alg: req.params.id,
		});
		if (rating) {
			if (rating.rate === req.body.rate)
				return res.status(400).send("User has rated.");
			await AlgorithmRating.findByIdAndRemove(rating._id);
			await algorithm.rate(-rating.rate);
		}

		rating = new AlgorithmRating({
			rate: req.body.rate,
			user: req.user._id,
			alg: req.params.id,
		});
		rating = await rating.save();
		algorithm = await algorithm.rate(req.body.rate);

		return res.send(_.pick(algorithm, ["_id", "rating"]));
	}
);

router.delete("/rate/:id", auth, async (req, res) => {
	const rating = await AlgorithmRating.findByIdAndRemove(req.params.id);
	if (!rating) return res.status(404).send("Rating not found.");

	res.send(rating);
});

module.exports = router;

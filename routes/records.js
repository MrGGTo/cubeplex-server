const express = require("express");
const router = express.Router();

const _ = require("lodash");

const Record = require("../models/record");
const validate = require("../middleware/validate");

// Get all records
router.get("/", async (req, res) => {
	const result = await Record.find();
	res.send(result);
});

// Get user's records
router.get("/:id", async (req, res) => {
	const user = await Record.find({ user: req.body.id });
	if (!user) return res.status(404).send("User not found.");

	const result = await Record.find({ user: req.params.id }).select(
		"time scramble"
	);

	res.send(result);
});

// Get User statistics
// router.get("/:id/statistics", async (req, res) => {
// 	const user = await Record.find({ user: req.params.id });
// 	if (!user) return res.status(404).send("User not found.");

// 	console.log(user);
// 	const statistics = await Record.aggregate([
// 		{
// 			$match: {
// 				user: mongoose.Types.ObjectId(req.params.id),
// 			},
// 		},
// 		{
// 			$group: { _id: "$user", average: { $avg: "$time" } },
// 		},
// 	]);

// 	res.send(statistics);
// });

// Create new record
router.post("/", validate(Record.validate), async (req, res) => {
	let record = new Record(req.body);
	record = await record.save();
	res.send(record);
});

// Update record
router.put("/:id", validate(Record.validate), async (req, res) => {
	const record = await Record.findByIdAndUpdate(
		req.params.id,
		{ time: req.body.time, scramble: req.body.scramble },
		{ new: true }
	);
	if (!record) return res.status(404).send("Record not found.");
	res.send(record);
});

// Delete record
router.delete("/:id", async (req, res) => {
	const deleted = await Record.findByIdAndRemove(req.params.id);
	if (!deleted) return res.status(404).send("Record not found.");
	res.send(deleted);
});

module.exports = router;

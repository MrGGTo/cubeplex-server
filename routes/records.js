const Record = require("../models/record");
const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();

router.get("/", async (req, res) => {
	const result = await Record.find();
	res.send(result);
});

router.post("/", validate(Record.validate), async (req, res) => {
	let record = new Record(req.body);
	record = await record.save();
	res.send(record);
});

router.put("/:id", validate(Record.validate), async (req, res) => {
	const record = await Record.findByIdAndUpdate(
		req.params.id,
		{ time: req.body.time, scramble: req.body.scramble },
		{ new: true }
	);
	if (!record) return res.status(404).send("Record not found.");
	res.send(record);
});

router.delete("/:id", async (req, res) => {
	const record = await Record.findByIdAndRemove(req.params.id);
	if (!record) return res.status(404).send("Record not found.");
	res.send(record);
});

module.exports = router;

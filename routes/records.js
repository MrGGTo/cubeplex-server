const _ = require("lodash");
const express = require("express");
const router = express.Router();

const Record = require("../models/record");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

// Get all records
router.get("/", async (req, res) => {
  const result = await Record.find();
  res.send(result);
});

// Get Starred Records
router.get("/starred", auth, async (req, res) => {
  const starredRecords = await Record.find({
    starred: true,
    user: req.user._id,
  });
  res.send(starredRecords);
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

// Create new record
router.post("/", [validate(Record.validate), auth], async (req, res) => {
  let record = new Record({
    ..._.pick(req.body, [
      "time",
      "scamble",
      "location",
      "starred",
      "description",
    ]),
    user: req.user,
  });
  record = await record.save();
  res.send(record);
});

// Update record
router.put("/:id", [validate(Record.validate), auth], async (req, res) => {
  const record = await Record.findByIdAndUpdate(
    req.params.id,
    { time: req.body.time, scramble: req.body.scramble },
    { new: true }
  );
  if (!record) return res.status(404).send("Record not found.");
  res.send(record);
});

// Star record
router.put("/:id/star", auth, async (req, res) => {
  let record = await Record.findById(req.params.id);
  if (!record) return res.status(404).send("Record not found.");

  record.toggleStar();
  record = await record.save();
  res.send({ starred: record.starred });
});

// Delete record
router.delete("/:id", auth, async (req, res) => {
  const deleted = await Record.findByIdAndRemove(req.params.id);
  if (!deleted) return res.status(404).send("Record not found.");
  res.send(deleted);
});

module.exports = router;

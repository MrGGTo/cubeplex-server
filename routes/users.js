const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const validate = require("../middleware/validate");
const Record = require("../models/record");
const auth = require("../middleware/auth");

// Get all users
router.get("/", async (req, res) => {
  let users = await User.find();
  users = users.map((user) => _.pick(user, ["_id", "name"]));
  res.send(users);
});

// Get one user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("displayRecord");
  if (!user) return res.status(404).send("User not found.");
  res.send(user);
});

router.get("/availability/:name", async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (user) res.status(400).send("Username already registered.");
  res.send("Username Available");
});

// Get User statistics
router.get("/:id/statistics", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found.");

  const statistics = await user.getStatistics();

  res.send(statistics);
});

// Register new user
router.post("/", validate(User.validate), async (req, res) => {
  let user = await User.findOne({ name: req.body.name });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();

  res.header("Authorization", token).send(_.pick(user, ["_id", "name"]));
});

// Update user
router.put("/", auth, async (req, res) => {
  const displayRecord = await Record.findById(req.body.displayRecord);
  if (!displayRecord) return res.status(404).send("Record not found.");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ..._.pick(req.body, ["displayRecord"]),
    },
    { new: true }
  );

  res.send(user);
});

// Delete user
router.delete("/:id", async (req, res) => {
  const deleted = await User.findByIdAndRemove(req.params.id);
  if (!deleted) return res.status(404).send("User not found.");
  res.send(deleted);
});

module.exports = router;

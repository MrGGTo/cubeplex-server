const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const validate = require("../middleware/validate");
const Record = require("../models/record");

// Get all users
router.get("/", async (req, res) => {
	const users = await User.find();
	res.send(users);
});

// Get one user
router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!record) return res.status(404).send("User not found.");
	res.send(user);
});

// Create new user
router.post("/", validate(User.validate), async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered.");

	user = new User(_.pick(req.body, ["name", "email", "password"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	user = await user.save();
	res.send(user);
});

// Delete user
router.delete("/:id", async (req, res) => {
	const deleted = await User.findByIdAndRemove(req.params.id);
	if (!deleted) return res.status(404).send("User not found.");
	res.send(deleted);
});

// Get User statistics
router.get("/:id/statistics", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found.");

	const statistics = await user.getStatistics();

	res.send(statistics);
});

module.exports = router;

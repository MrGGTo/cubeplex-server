const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const User = require("../models/user");

router.post("/", validate(validator), async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password.");

	const validPassword = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (!validPassword)
		return res.status(400).send("Invalid email or password.");

	const token = user.generateAuthToken();

	res.send(token);
});

function validator(user) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
			.required(),
	});
	return schema.validate(user);
}

module.exports = router;

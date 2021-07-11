const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Record = require("./record");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 5,
		maxlength: 255,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		maxlength: 1024,
	},
	token: {
		type: String,
	},
	displayRecord: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Record",
	},
});

userSchema.statics.validate = function (user) {
	const schema = Joi.object({
		name: Joi.string().alphanum().min(3).max(50).required(),
		email: Joi.string().email().required(),
		password: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
			.required(),
		repeat_password: Joi.ref("password"),
	});
	return schema.validate(user);
};

userSchema.methods.getStatistics = function () {
	return Record.aggregate([
		{
			$match: {
				user: mongoose.Types.ObjectId(this._id),
			},
		},
		{
			$group: {
				_id: "$user",
				average: { $avg: "$time" },
				best: { $min: "$time" },
				worst: { $max: "$time" },
			},
		},
	]);
};

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, name: this.name },
		process.env.JWT_KEY
	);
	return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");
const joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const algorithmSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		maxlength: 255,
	},
	alg: {
		type: String,
		required: true,
		trim: true,
		minlength: 4,
		maxlength: 255,
	},
	case: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Case",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Case",
	},
});

const Algorithms = mongoose.model("Algorithms", algorithmSchema);

module.exports = Algorithms;

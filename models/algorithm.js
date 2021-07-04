const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const algorithmSchema = new mongoose.Schema({
	alg: {
		type: String,
		required: true,
		unique: true,
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
		ref: "User",
	},
});

algorithmSchema.statics.validate = function (newCase) {
	const schema = Joi.object({
		alg: Joi.string().min(4).max(255).required(),
		case: Joi.objectId().required(),
		user: Joi.objectId(),
	});
	return schema.validate(newCase);
};

const Algorithm = mongoose.model("Algorithms", algorithmSchema);

module.exports = Algorithm;

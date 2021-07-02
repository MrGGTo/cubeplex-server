const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const recordSchema = new mongoose.Schema({
	time: {
		type: Number,
		required: true,
		default: Date.now,
	},
	scramble: {
		type: String,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

recordSchema.statics.validate = function (record) {
	const schema = Joi.object({
		time: Joi.number().required(),
		scramble: Joi.string(),
		user: Joi.objectId().required(),
	});
	return schema.validate(record);
};

recordSchema.methods.getTime = function () {
	return this._id.getTimestamp();
};

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;

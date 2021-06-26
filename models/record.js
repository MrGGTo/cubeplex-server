const mongoose = require("mongoose");
const Joi = require("joi");

const recordSchema = new mongoose.Schema({
	time: {
		type: Number,
		required: true,
		default: Date.now,
	},
	scramble: {
		type: String,
	},
});

recordSchema.statics.validate = function (record) {
	const schema = Joi.object({
		time: Joi.number().required(),
		scramble: Joi.string(),
	});
	return schema.validate(record);
};

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;

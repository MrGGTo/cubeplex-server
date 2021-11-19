const mongoose = require("mongoose");
const Joi = require("joi");

const caseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 255,
  },
  type: {
    type: String,
    enum: ["oll", "pll", "other"],
    required: true,
    lowercase: true,
  },
});

caseSchema.statics.validate = function (caseObj) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    type: Joi.string().required(),
  });
  return schema.validate(caseObj);
};

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;

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
  rating: {
    type: Number,
    default: 0,
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

algorithmSchema.statics.validateRate = function (rate) {
  const schema = Joi.object({
    rate: Joi.number().valid(1, -1).required(),
  });
  return schema.validate(rate);
};

algorithmSchema.methods.rate = function (rate) {
  this.rating += rate;
  return this.save();
};

const Algorithm = mongoose.model("Algorithms", algorithmSchema);

module.exports = Algorithm;

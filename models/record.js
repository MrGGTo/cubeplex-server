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
  starred: {
    type: Boolean,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  location: {
    type: new mongoose.Schema(
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      { _id: false }
    ),
  },
});

recordSchema.statics.validate = function (record) {
  const schema = Joi.object({
    time: Joi.number().required(),
    scramble: Joi.string(),
    starred: Joi.boolean(),
    description: Joi.string().min(1).max(255),
    location: Joi.object(),
  });
  return schema.validate(record);
};

recordSchema.methods.getTime = function () {
  return this._id.getTimestamp();
};

recordSchema.methods.toggleStar = function () {
  this.starred = !this.starred;
};

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;

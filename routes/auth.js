const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const User = require("../models/user");


router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/", validate(validator), async (req, res) => {
  let user = await User.findOne({ name: req.body.name });
  if (!user) return res.status(400).send("Invalid name or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid name or password.");

  const token = user.generateAuthToken();
  user = _.pick(user, ["_id", "name"]);
  res.send({ user, token });
});

function validator(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate(user);
}

module.exports = router;

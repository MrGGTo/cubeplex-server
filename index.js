require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const records = require("./routes/records");
const users = require("./routes/users");
const cases = require("./routes/cases");
const algorithms = require("./routes/algorithms");
const auth = require("./routes/auth");

const databaseHostUrl = `mongodb+srv://cubeplex-api:${process.env.DB_HOST_KEY}@development.chioc.mongodb.net/cubeplex?retryWrites=true&w=majority`;

mongoose
	.connect(process.env.DB_HOST || databaseHostUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.log(err));

app.use(express.json());
app.use("/api/records", records);
app.use("/api/users", users);
app.use("/api/cases", cases);
app.use("/api/algorithms", algorithms);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

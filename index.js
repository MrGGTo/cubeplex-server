require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const records = require("./routes/records");
const users = require("./routes/users");

mongoose
	.connect(process.env.DB_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.log(err));

app.use(express.json());
app.use("/api/records", records);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

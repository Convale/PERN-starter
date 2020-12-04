/* eslint-disable no-console */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const config = require("./helpers/config");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.data = {};
  next();
});

app.use("/api", require("./routes"));
app.use("/auth", require("./auth"));

app.use("/", (req, res) => {
  res.status(404).send("Not Found");
});

// error handling
// app.use((err, req, res) => {
//   console.warn(err);
//   res.status(500).json({ error: err, message: err.message });
// });

const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
  console.log(`server initialized on port ${PORT}`);
});

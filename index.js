const express = require("express");
const path = require("path");
const app = express();
const { db } = require("./server/db/");

const PORT = process.env.PORT || 8080;

const morgan = require("morgan");
app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
app.use(express.static(path.join(__dirname, "./public/")));

// api routes
app.use("/api", require("./server/api"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
}); // Send index.html for any other requests

// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

db.sync().then(() => {
  console.log("db synced");
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Puppeteer service running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
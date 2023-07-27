const package = require("../package.json");
const express = require("express");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ app: `${package.name} - ${package.version}` });
});

module.exports = router;

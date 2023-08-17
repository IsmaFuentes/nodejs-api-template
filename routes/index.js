const fs = require("fs");
const package = require("../package.json");
const express = require("express");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ app: `${package.name} - ${package.version}` });
});

/**
 * Registro dinamico de los routers
 */
fs.readdirSync(__dirname)
  .filter((e) => e.match(".router"))
  .forEach((file) => {
    const endpoint = `/${file.replace(".router.js", "")}`;
    router.use(endpoint, require(`./${file}`));
  });

module.exports = router;

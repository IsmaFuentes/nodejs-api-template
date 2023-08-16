/**
 * Rergistro dinámico de los modelos
 */
const fs = require("fs");

const models = fs
  .readdirSync(__dirname)
  .filter((e) => e.match(".model"))
  .reduce((acc, file) => {
    const model = file.replace(".model.js", "");
    acc[model] = require(`./${file}`);
    return acc;
  }, {});

module.exports = models;

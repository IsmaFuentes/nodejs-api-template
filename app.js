const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const models = require("./models");

dotenv.config();

const { Application, Server } = require("./server");

/**
 * Mongoose config
 */
const db =
  process.env.NODE_ENV === "development"
    ? process.env.FULL_DB_URI_DEV
    : process.env.FULL_DB_URI_PRO;

mongoose.set("strictQuery", false);
mongoose.connect(db, { autoIndex: true });

mongoose.connection.on("connected", function () {
  const name = db.replace(/:\/\/(.*)@/g, "://********@");
  console.log(`[SERVER]: MongoDB connection is open to ${name}`);
});

mongoose.connection.on("error", function (err) {
  console.log("[SERVER]: MongoDB connection has occured " + err + " error");
});

mongoose.connection.on("disconnected", function () {
  console.log("[SERVER]: MongoDB connection is disconnected ");
});

/**
 * App config
 */
Application.set("trust proxy", true);
Application.set("port", process.env.PORT || 3005);
Application.disable("x-powered-by");
Application.use(cors({ credentials: true, origin: true }));
Application.use(express.urlencoded({ limit: "10mb", extended: true }));
Application.use(express.json({ limit: "10mb" }));
Application.use(express.static(`${__dirname}/`));
Application.use(require("./routes"));

/**
 * Server config
 */
Server.listen(Application.get("port"), () => {
  console.log(
    `[SERVER]: Server running in port ${Server.address().port} | env: ${
      process.env.NODE_ENV || "development"
    }`
  );
});

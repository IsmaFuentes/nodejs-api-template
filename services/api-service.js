const mongoose = require("mongoose");
const { catchAsync } = require("../utils/catchAsync");

/**
 * Mongoose CRUD Service
 * @param {String} modelName
 * @returns
 */
const MongooseService = (modelName) => {
  return {
    Instance: mongoose.model(modelName),

    Get: function (id) {
      return mongoose.model(modelName).findById(id);
    },

    GetOne: function (filter = {}) {
      return mongoose.model(modelName).findOne(filter);
    },

    GetAll: function (filter = {}) {
      return mongoose.model(modelName).find(filter);
    },

    Create: function (body) {
      return mongoose.model(modelName).create(body);
    },

    Update: function (id, body) {
      return mongoose.model(modelName).findByIdAndUpdate(id, body, {
        runValidators: true,
        new: true,
        context: "query",
      });
    },

    Delete: function (id, filter = {}) {
      if (Array.isArray(id)) {
        return mongoose
          .model(modelName)
          .deleteMany({ ...filter, _id: { $in: id } });
      } else {
        return mongoose.model(modelName).findByIdAndDelete(id);
      }
    },
  };
};

/**
 * Mongoose REST Service
 * @param {String} modelName
 * @returns
 */
const RestService = (modelName) => {
  const Service = MongooseService(modelName);
  return {
    MongooseInstance: Service.Instance,
    GetAll: catchAsync(async function (req, res) {
      const filter = Object.fromEntries(
        Object.entries(req.query ?? {}).map(([key, value]) => [
          key,
          JSON.parse(value),
        ])
      );

      const documents = await Service.GetAll({ ...filter }).lean();
      res.status(200).json(documents);
    }),

    GetDocumentById: catchAsync(async function (req, res) {
      const { id } = req.params;
      const document = await Service.Get(id);
      if (!document) {
        return res.status(404).json("Not found.");
      }
      res.status(200).json(document);
    }),

    CreateDocument: catchAsync(async function (req, res) {
      const { establishment } = req.decoded;
      req.body.establishment = establishment;
      const newDocument = await Service.Create(req.body);
      res.status(201).json(newDocument);
    }),

    UpdateDocument: catchAsync(async function (req, res) {
      const { id } = req.params;
      const updatedDocument = await Service.Update(id, req.body);
      if (!updatedDocument) {
        return res.status(404).json("Not found.");
      }
      res.status(200).json(updatedDocument);
    }),

    DeleteDocumentById: catchAsync(async function (req, res) {
      const { id } = req.params;
      const query = await Service.Delete(id);
      if (!query) {
        return res.status(404).json("Not found.");
      }
      res.status(204).json(1);
    }),

    DeleteManyDocuments: catchAsync(async function (req, res) {
      const { establishment } = req.decoded;
      const ids = req.body;
      const query = await Service.Delete(ids, { establishment });
      if (query.deletedCount > 0) {
        return res.status(200).json(`Deleted count: ${query.deletedCount}`);
      }
      res.status(404).json("Not found.");
    }),
  };
};

module.exports = { MongooseService, RestService };

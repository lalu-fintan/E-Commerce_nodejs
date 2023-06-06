const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  const valid = mongoose.Schema.Types.ObjectId.isValid(id);
  if (!valid) {
    throw new Error("This id is not valid");
  }
};

module.exports = validateMongoDbId;

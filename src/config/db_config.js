const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URL);
    console.log(connect.connection.host, connect.connection.name);
  } catch (err) {
    console.log("error occured in database");
  }
};

module.exports = connectDb;

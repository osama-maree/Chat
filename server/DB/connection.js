const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then((res) => {
      console.log("connectDB");
    })
    .catch((err) => {
      console.log("fail to connectDB", err);
    });
};
module.exports = connectDB;

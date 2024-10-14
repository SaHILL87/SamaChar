import mongoose from "mongoose";
const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "samachar" })
    .then((data) => {
      console.log(`Connected to DB : ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

export default connectDB;

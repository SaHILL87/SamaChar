import dotenv from "dotenv"; // Import dotenv
// import expressAsyncErrors from "express-async-errors"; // Import express-async-errors

dotenv.config();
// expressAsyncErrors();

import connectDB from "./db/connect.js"; // Add .js extension if needed
import express from "express";
import cors from "cors";
import mainRouter from "./routes/user.js"; // Add .js extension if needed

const app = express();

app.use(express.json());

app.use(cors());
app.use("/api/v1", mainRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const MONGODB_URI = process.env.MONGO_URI;

mongoose
  .connect(`${MONGODB_URI}`)
  .then(() => console.log("database connected"))
  .catch((err) => console.log("database not connected", err));

//middleware
app.use(cookieParser());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);
const port = 8000;
app.listen(port, () => console.log("Node running on port " + `${port}`));

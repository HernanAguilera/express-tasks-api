import express, { Request, Response } from "express";
import { config } from "dotenv";
import apiTasks from "./routes/tasks";

config();

// var logger = require("morgan");

const app = express();

app.use(function (req: Request, res: Response, next: Function) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/tasks", apiTasks);

module.exports = app;

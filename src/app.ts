import express, { Request, Response } from "express";
import { config } from "dotenv";
import apiTasks from "./routes/tasks";
import apiUsers from "./routes/user";
import cors from "cors";

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
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/tasks", apiTasks);
app.use("/", apiUsers);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
export default app;

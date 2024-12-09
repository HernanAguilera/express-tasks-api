import express, { Request, Response } from "express";
import { config } from "dotenv";
import app from "./app";

config();
console.log(process.env.PORT);

const PORT = process.env.PORT;

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

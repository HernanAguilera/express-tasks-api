import { Dialect, Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const conecction = new Sequelize({
  dialect: process.env.DB_DIALECT as Dialect,
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  logging: process.env.APP_ENV === "development",
});

conecction
  .authenticate()
  .then(() => {
    // console.log("Connection has been established successfully.");
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database:", error);
  });

export default conecction;

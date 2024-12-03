import { Task, User } from "../models";

const initialize = async () => {
  await User.sync({ force: true });
  await Task.sync({ force: true });
  console.log("Database initialized successfully.");
};

initialize();

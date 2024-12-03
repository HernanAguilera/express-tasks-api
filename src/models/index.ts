import { Task } from "./Task";
import { User } from "./User";

Task.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Task, { foreignKey: "userId" });

export { Task, User };

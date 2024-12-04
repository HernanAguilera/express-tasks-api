import { DataTypes } from "sequelize";
import conecction from "../db";

const User = conecction.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,

    // allowNull: false,
  },
});

const safeDataValues = function (user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

export { User, safeDataValues };

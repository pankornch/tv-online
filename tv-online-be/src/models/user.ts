import { DataTypes } from "sequelize";
import sequelize from "../utils/db";
import { EUserRole } from "../types";

const User = sequelize.define(
  "user",
  {
    // id: {
    //   type: DataTypes.UUIDV4,
    //   allowNull: false,
    //   primaryKey: true,
    // },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(EUserRole.ADMIN, EUserRole.USER),
      defaultValue: EUserRole.USER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default User;

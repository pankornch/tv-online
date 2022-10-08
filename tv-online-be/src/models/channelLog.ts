import sequelize from "../utils/db";
import { DataTypes } from "sequelize";

const ChannelLog = sequelize.define(
  "channelLog",
  {
    channelID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

export default ChannelLog;

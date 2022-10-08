import sequelize from "../utils/db";
import { DataTypes } from "sequelize";

const ChannelChat = sequelize.define(
  "channelChat",
  {
    channelID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

export default ChannelChat;

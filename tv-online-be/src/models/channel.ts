import { DataTypes } from "sequelize";
import { HOST_NAME } from "../utils/env";
import sequelize from "../utils/db";

const Channel = sequelize.define(
  "channel",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const image: string = this.getDataValue("image");
        if (image.startsWith("http")) return image;

        const url = `${HOST_NAME}/api/v1/image/${image}`;
        return url;
      },
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default Channel;

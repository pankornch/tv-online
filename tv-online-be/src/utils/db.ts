import { Sequelize } from "sequelize";
import { PG_URI } from "../utils/env";

const sequelize = new Sequelize(PG_URI!);

export async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default sequelize;

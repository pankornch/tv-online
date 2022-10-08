import { Client } from "pg";

const client = new Client({
  user: "postgres",
  password: "admin",
  host: "localhost",
  database: "postgres",
});

client.connect();

client.query("CREATE DATABASE tv_online", (err, res) => {
  console.log(err, res);
  client.end();
});

import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import router from "./src/routes";
import cors from "cors";
import sequelize, { authenticate } from "./src/utils/db";
import setupSocket from "./src/routes/socket";
import swaggerUi from "swagger-ui-express";
import swaggerJSON from "./swagger.json";

const PORT = process.env.PORT || 5500;
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: "*",
    methods: "*",
  })
);
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSON));

// routes
app.use("/api/v1/", router);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

setupSocket(io);

async function startServer() {
  await authenticate();
  // start server
  sequelize.sync();
  server.listen(PORT, () =>
    console.log(`server is running on http://localhost:${PORT}`)
  );
}

startServer();

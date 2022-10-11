import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";
import router from "./src/routes";
import cors from "cors";
import { authenticate } from "./src/utils/db";
import swaggerUi from "swagger-ui-express";
import swaggerJSON from "./swagger.json";
import SocketController from "./src/controllers/socket";
import { PORT } from "./src/utils/env";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
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
    origin: "*",
  },
});

const socketController = new SocketController(io);
socketController.setup();

async function startServer() {
  await authenticate();
  // start server
  server.listen(PORT, () =>
    console.log(`server is running on http://localhost:${PORT}`)
  );
}

startServer();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import apiRouter from "./routes/api.js";
import { swaggerSpec } from "./config/swagger.js";
import { initializeSocket } from "./socket/handler.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ["GET", "POST"],
    }
});

app.use(express.json({ limit: "5mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", apiRouter);

initializeSocket(io);

server.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);
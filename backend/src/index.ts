import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import apiRouter from "./routes/api.js";
import { swaggerSpec } from "./config/swagger.js";
import { initializeSocket } from "./socket/handler.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173"; 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST"],
    }
});

app.use(cors({
    origin: FRONTEND_ORIGIN, 
}));

app.use(express.json({ limit: "5mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", apiRouter);

initializeSocket(io);

server.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);
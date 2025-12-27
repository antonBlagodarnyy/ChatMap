import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import configWs from "./webSocketConnection.js";


//General config
dotenv.config();
const app = express();

//Rest config
const port = process.env.PORT!;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


//Ws config
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/messages" });

configWs(wss);

//Run endpoints
server.listen(port, () => {
  console.log(`servert listening on port: ${port}`);
});

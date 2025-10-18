import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerCreateUser from "./events/User/createUser.js";
import routerLogin from "./events/User/login.js";
import routerCreateLocation from "./events/Location/createLocation.js";
import routerCurrentLocation from "./events/Location/currentLocation.js";
import routerNearbyLocation from "./events/Location/nearbyLocation.js";
import routerUserData from "./events/User/userData.js";
import http from "http";
import { WebSocketServer } from "ws";
import configWs from "./events/Chat/webSocketConnection.js";

dotenv.config();
const app = express();
const server = http.createServer();
const wsPort = 3001;
const restPort = 3000;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "http://localhost:54423"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  "/location",
  routerCreateLocation,
  routerCurrentLocation,
  routerNearbyLocation
);
app.use("/user", routerCreateUser, routerLogin, routerUserData);

const wss = new WebSocketServer({ server });

configWs(wss);

server.listen(wsPort, () => {
  console.log(`ws listening on port: ${wsPort}`);
});
app.listen(restPort, () => {
  console.log(`rest listening on port ${restPort}`);
});

import { WebSocketServer, WebSocket } from "ws";
import { insertMessage } from "./controller";
import { IMessage } from "./IMessage";

const url = require("url");
const jwt = require("jsonwebtoken");
const wss = new WebSocketServer({ port: 8081 });

// Maps user IDs (sub from JWT) to WebSocket connections
const clients = new Map<number, WebSocket>();

wss.on("connection", function connection(ws, req) {
  console.log("Connected");

  const params = new URLSearchParams(url.parse(req.url).query);
  const token = params.get("token");

  if (!token) {
    console.error("Missing token");
    ws.close();
    return;
  }

  let decoded: any;

  try {
    //TODO store token secret in .env
    decoded = jwt.verify(token, "my_super_secure_32_characters_key!");
    console.log("Authenticated user:", decoded.sub);

    // Save this user's WebSocket connection
    clients.set(+decoded.sub, ws);

    // Store user info on the socket for later use
    (ws as any).user = decoded;
  } catch (error: any) {
    console.error("Invalid JWT: " + error.message);
    ws.close();
    return;
  }

  // Handle incoming messages
  ws.on("message", function message(data) {
    try {
  
      const parsed: IMessage = JSON.parse(data.toString());

      const senderId: number = (ws as any).user.sub;
      console.log(senderId);
      const { from, to, text } = parsed;

      console.log(`Message from ${senderId} to ${to}: ${text}`);

      const recipientWs = clients.get(to);

      //push new message to the db
      insertMessage(text, senderId, to);

      //Send the msg
      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(
          JSON.stringify({
            from: senderId,
            to: to,
            text: text,
          })
        );
      } else {
        console.warn(`Recipient ${to} not connected.`);
      }
    } catch (err) {
      console.error("Invalid message format", err);
    }
  });

  ws.on("close", () => {
    const userId = (ws as any).user?.sub;
    if (userId) {
      clients.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });


});

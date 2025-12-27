import { WebSocketServer, WebSocket } from "ws";
import type { UnsavedMessage } from "./Interfaces/UnsavedMessage.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import type { SavedMessage } from "./Interfaces/SavedMessage.js";
import type { ConnectionMessage } from "./Interfaces/ConnectionMessage.js";
import type { Message } from "./Interfaces/Message.js";
import type { AuthWebSocket } from "./Interfaces/AuthWebsocket.js";

function configWs(wss: WebSocketServer) {
  // Maps user IDs (sub from JWT) to WebSocket connections
  const clients = new Map<number, WebSocket>();

  wss.on("connection", function connection(ws, req) {
    const authWebSocket = ws as AuthWebSocket;

    // Handle incoming messages
    ws.on("message", async function message(data) {
      const message: Message = JSON.parse(data.toString());

      if (message.type === "CONNECTION") {
        handleConnection(message, authWebSocket, clients);
      } else if (message.type === "UNSAVED") {
        handleUnsavedMessage(message, authWebSocket, clients);
      }
    });

    ws.on("close", () => {
      if (authWebSocket.userId) {
        clients.delete(authWebSocket.userId);
        console.log(`User ${authWebSocket.userId} disconnected`);
      }
    });
  });
}

function handleConnection(
  message: ConnectionMessage,
  ws: AuthWebSocket,
  clients: Map<number, WebSocket>
) {
  if (!message.token) {
    console.error("Missing token");
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(message.token, process.env.JWT_KEY!);
    console.log("Authenticated user:", decoded.sub);

    if (decoded.sub) {
      // Save this user's WebSocket connection
      clients.set(+decoded.sub, ws);

      // Store user info on the socket for later use
      ws.token = message.token;
      ws.userId = +decoded.sub;
    }
  } catch (error: any) {
    console.error("Invalid JWT: " + error.message);
    ws.close();
  }
}

async function handleUnsavedMessage(
  message: UnsavedMessage,
  ws: AuthWebSocket,
  clients: Map<number, WebSocket>
) {
  try {
    //Post message to db
    const saveMsgRes = await axios.post<SavedMessage>(
      `${process.env.API_URL}/message/save`,
      message,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ws.token,
        },
      }
    );

    //Return the msg to the sender
    ws.send(JSON.stringify(saveMsgRes.data));

    //Send the msg to the receiver
    const recipientWs = clients.get(saveMsgRes.data.receiver);
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify(saveMsgRes.data));
    } else {
      console.warn(`Recipient ${message.receiver} not connected.`);
    }
  } catch (err) {
    console.error("Invalid message format", err);
  }
}

export default configWs;

import { WebSocketServer, WebSocket } from "ws";
import type { UnsavedMessage } from "./Interfaces/UnsavedMessage.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import type { SavedMessage } from "./Interfaces/SavedMessage.js";

function configWs(wss: WebSocketServer) {
  // Maps user IDs (sub from JWT) to WebSocket connections
  const clients = new Map<number, WebSocket>();

  wss.on("connection", function connection(ws, req) {
    const token = req.url?.split("token=")[1];

    if (!token) {
      console.error("Missing token");
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY!);
      console.log("Authenticated user:", decoded.sub);

      if (decoded.sub) {
        // Save this user's WebSocket connection
        clients.set(+decoded.sub, ws);

        // Store user info on the socket for later use
        (ws as any).user = decoded;
      }
    } catch (error: any) {
      console.error("Invalid JWT: " + error.message);
      ws.close();
      return;
    }

    // Handle incoming messages
    ws.on("message", async function message(data) {
      try {
        const unsavedMessage: UnsavedMessage = JSON.parse(data.toString());

        //Post message to db
        const saveMsgRes = await axios.post<SavedMessage>(
          `${process.env.API_URL}/message/save`,
          unsavedMessage,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        const recipientWs = clients.get(saveMsgRes.data.receiver);

        //Send the msg to the receiver
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(
            JSON.stringify(
              saveMsgRes.data
            )
          );

          //Return the msg to the sender
          ws.send(
            JSON.stringify( saveMsgRes.data)
          );
        } else {
          console.warn(`Recipient ${unsavedMessage.receiver} not connected.`);
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
}

export default configWs;

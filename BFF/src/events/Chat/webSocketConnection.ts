import { WebSocketServer, WebSocket } from "ws";
import type { IWsMessage } from "../../Interfaces/IWsMessage.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const configWs = (wss: WebSocketServer) => {
  // Maps user IDs (sub from JWT) to WebSocket connections
  const clients = new Map<number, WebSocket>();

  wss.on("connection", function connection(ws, req) {
    const token = req.url?.split("token=")[1];

    if (!token) {
      console.error("Missing token");
      ws.close();
      return;
    }

    let decoded: any;

    try {

      decoded = jwt.verify(token, process.env.JWT_KEY!);
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
        const parsedMsg: IWsMessage = JSON.parse(data.toString());

        const senderId: number = (ws as any).user.sub;

        console.log(`Message from ${senderId} to ${parsedMsg.to}: ${parsedMsg.msg}`);

        const recipientWs = clients.get(parsedMsg.to);

        //Post message to db
        axios.post(
          `${process.env.MESSAGE_URL}/message/save`,
          { receiver: parsedMsg.to, text: parsedMsg.msg },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        //Send the msg
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(
            JSON.stringify({
              to: parsedMsg.to,
              msg: parsedMsg.msg,
            })
          );
        } else {
          console.warn(`Recipient ${parsedMsg.to} not connected.`);
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
};

export default configWs;

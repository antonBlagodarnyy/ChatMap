import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
import type { IChatPreviewDTO } from "../../Interfaces/IChatPreviewDTO.js";
import parseUserIds from "../../utils/parseUserIds.js";

const routeChatHistoryRetrieve = express.Router();

routeChatHistoryRetrieve.get("/retrieveChats", jwtCheck, async (req, res) => {
  const token = req.header("Authorization");

  if (token)
    try {
      const routeChatsRetrieveRes = await axios.get<IChatPreviewDTO[]>(
        `${process.env.MESSAGE_URL}/message/retrieveConversations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const rawChats = routeChatsRetrieveRes.data;

      if (rawChats.length > 0) {
        //Map of the users ids to their respective username
        const idSet = new Set([
          ...rawChats.map((item) => item.partnerId),
          ...rawChats.map((item) => item.message.receiver),
          ...rawChats.map((item) => item.message.sender),
        ]);
 
        const usernamesMap = await parseUserIds(idSet, token);

        if (!usernamesMap)
          throw Error(
            "[retrieveChatHistory.ts -> routeChatHistoryRetrieve.get()]: usernamesMap is undefined"
          );

        const chats = rawChats.map((r) => {
          return {
            ...r,
            message: {
              ...r.message,
              sender: usernamesMap[r.message.sender] ?? "unknown",
              receiver: usernamesMap[r.message.receiver] ?? "unknown",
            },
            partnerName: usernamesMap[r.partnerId] ?? "unknown",
          };
        });
        res.status(200).json({ chats: chats });
      } else res.status(200).json({ chats: {} });
    } catch (err: any) {
      console.error(
        `[retrieveChatHistory.ts -> routeChatHistoryRetrieve.get()] `,
        err
      );
      //If failed, return an error
      const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
      const msg =
        err.code == "ECONNREFUSED"
          ? "Server unavailable"
          : err.response.data.error;
      return res.status(status).json({ error: msg });
    }
});

export default routeChatHistoryRetrieve;

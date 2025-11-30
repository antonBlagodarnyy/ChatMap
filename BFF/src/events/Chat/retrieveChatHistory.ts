import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
import type { IResponseMessageDTO } from "../../Interfaces/IResponseMessageDTO.js";

const routeChatHistoryRetrieve = express.Router();

routeChatHistoryRetrieve.get("/retrieveChats", jwtCheck, async (req, res) => {
  const token = req.header("Authorization");

  if (token)
    try {
      const routeChatsRetrieveRes = await axios.get<IResponseMessageDTO[]>(
        `${process.env.MESSAGE_URL}/message/retrieveConversations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
       } catch (err: any) {
      console.log(`[retrieveChatHistory.ts -> routeChatHistoryRetrieve.get()] \n ${err.response}`);
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
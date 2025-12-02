import axios, { AxiosError } from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
import type { IResponseMessageDTO } from "../../Interfaces/IResponseMessageDTO.js";
import parseUserIds from "../../utils/parseUserIds.js";

const routeMessagesRetrieve = express.Router({ mergeParams: true });

routeMessagesRetrieve.get(
  "/retrieveMessages/:receiver",
  jwtCheck,
  async (req, res) => {
    const token = req.header("Authorization");

    if (token)
      try {
        const routeMessagesRetrieveRes = await axios.get<IResponseMessageDTO[]>(
          `${process.env.MESSAGE_URL}/message/retrieveMessages`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            params: {
              receiver: req.params.receiver,
            },
          }
        );

        const rawMessages = routeMessagesRetrieveRes.data;

        if (rawMessages.length > 0) {
          //Map of the users ids to their respective username
          const idSet = new Set([
            ...rawMessages.map((item) => item.sender),
            ...rawMessages.map((item) => item.receiver),
          ]);
        

          const usernamesMap = await parseUserIds(idSet, token);

          if (!usernamesMap)
            throw Error(
              "[RetrieveMessages.ts -> routeMessagesRetrieve.get()]: usernamesMap is undefined"
            );

          const messages = rawMessages.map((r) => {
            return {
              ...r,
              sender: usernamesMap[r.sender] ?? "unknown",
              receiver: usernamesMap[r.receiver] ?? "unknown",
            };
          });
          res.status(200).json({ messages: messages });
        } else res.status(200).json({ messages: {} });
      } catch (err: any) {
        console.error(
          `[retrieveMessages.ts -> routeMessagesRetrieve.get()]`,
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
    else res.status(401).json({ message: "no token" });
  }
);

export default routeMessagesRetrieve;

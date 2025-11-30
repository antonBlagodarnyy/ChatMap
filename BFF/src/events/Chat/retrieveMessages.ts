import axios, { AxiosError } from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
import type { IResponseMessageDTO } from "../../Interfaces/IResponseMessageDTO.js";
import parseSendersAndReceivers from "../../utils/parseMessages.js";

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

        const messages = await parseSendersAndReceivers(
          routeMessagesRetrieveRes.data,
          token,
          res
        );

        res.status(200).json({ messages: messages });
      } catch (err: any) {
        console.log(
          `[retrieveMessages.ts -> routeMessagesRetrieve.get()] \n ${err.response}`
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

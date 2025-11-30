import axios from "axios";
import type { IResponseMessageDTO } from "../Interfaces/IResponseMessageDTO.js";
import type {Response } from "express";

const parseSendersAndReceivers = async (
  messages: IResponseMessageDTO[],
  token: string, 
  res: Response
) => {
  if (token) {
    //Map of the users ids to their respective username
    const idSet = new Set(messages.map((item) => item.sender));
    idSet.union(new Set(messages.map((item) => item.receiver)));
    const usersIds = [...idSet];

    if (usersIds.length != 0) {
      try{
        const sendersUsernamesRes = await axios.get(
        `${process.env.PROFILE_URL}/profile/usernamesById`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          params: {
            usersIds: usersIds,
          },
        }
      );

      const usernames = sendersUsernamesRes.data.usernames;
      messages.map((msg) => {
        const senderUsername = usernames[String(msg.sender)];
        const receiverUsername = usernames[String(msg.receiver)];
        return {
          ...msg,
          sender: senderUsername || msg.sender,
          receiver: receiverUsername || msg.receiver,
        };
      });
      } catch ( err: any){
        console.log(`[parseMessages -> parseSendersAndReceivers()] \n ${err.response}`);
      //If failed, return an error
      const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
      const msg =
        err.code == "ECONNREFUSED"
          ? "Server unavailable"
          : err.response.data.error;
      return res.status(status).json({ error: msg });
    }
      
      
    }
  }
  return messages;
};
 
export default parseSendersAndReceivers;
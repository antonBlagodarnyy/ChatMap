import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
import type { IRequestMessage } from "../../Interfaces/IRequestMessage.js";

const routeMessagesRetrieve = express.Router({ mergeParams: true });

routeMessagesRetrieve.get("/retrieve/:receiver", jwtCheck, async (req, res) => {
  const token = req.header("Authorization");

  if (token)
    try {
      const routeMessagesRetrieveRes = await axios.get<IRequestMessage[]>(
        `${process.env.MESSAGE_URL}/message/retrieve`,
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

      const usersIds = [
        ...new Set(routeMessagesRetrieveRes.data.map((item) => item.sender)),
      ];

      console.log(usersIds)

      var locations = routeMessagesRetrieveRes.data;

      if(usersIds.length!=0){
 
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


      locations = routeMessagesRetrieveRes.data.map((msg) => {
        const username = sendersUsernamesRes.data.usernames[String(msg.sender)];
        console.log(username)
        return {
          ...msg,
          sender: username || msg.sender, // fallback si no se encuentra username
        };
      });

      }


  
      res.status(200).json({ locations: locations });
    } catch (err: any) {
      console.log(err);
      //If failed, return an error
      const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
      const msg =
        err.code == "ECONNREFUSED"
          ? "Server unavailable"
          : err.response.data.error;
      return res.status(status).json({ error: msg });
    }
  else res.status(401).json({ message: "no token" });
});

export default routeMessagesRetrieve;

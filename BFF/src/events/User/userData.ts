import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";

const routerUserData = express.Router({ mergeParams: true });

//TODO store and retrieve more data than the username
routerUserData.get("/data/:userId", jwtCheck, async (req, res) => {
  console.log("HIT");
  const token = req.header("Authorization");
  //TODO return res when there is no jwt
  if (token)
    try {
      const userDataRes = await axios.get(
        `${process.env.PROFILE_URL}/profile/userData`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          params: {
            userId: req.params.userId,
          },
        }
      );

      res.status(200).json(userDataRes.data.userData);
    } catch (err: any) {
      //If failed, return an error
      const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
      const msg =
        err.code == "ECONNREFUSED"
          ? "Server unavailable"
          : err.response.data.error;
      return res.status(status).json({ error: msg });
    }
});

export default routerUserData;

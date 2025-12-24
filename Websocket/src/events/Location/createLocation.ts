import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";

const routerCreateLocation = express.Router();

routerCreateLocation.post("/create", jwtCheck, async (req, res) => {
  const token = req.header("Authorization");
  if (token)
    try {
      await axios.post(
        `${process.env.LOCATION_URL}/location/create`,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      res.status(200).json({ message: "location created!" });
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

export default routerCreateLocation;

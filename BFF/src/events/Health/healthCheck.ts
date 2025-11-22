import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const routerHealth = express.Router();

const healthUrl = "/health";

const urls = [
  process.env.AUTH_URL  +healthUrl,
  process.env.PROFILE_URL  + healthUrl,
  process.env.LOCATION_URL + healthUrl,
  process.env.MESSAGE_URL  + healthUrl,
];

routerHealth.get("/check", async (req, res) => {
  for (const url of urls) {
    
    try {
      await axios.get(url);
    } catch (err: any) {
      //If failed, return an error
      
      const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
      const msg =
        err.code == "ECONNREFUSED"
          ? "Server unavailable"
          : err.response.data.error;
      return res.status(status).json({ error: msg });
    }
  }
  res.status(200).json({ message: "All servers ok" });
});

export default routerHealth;

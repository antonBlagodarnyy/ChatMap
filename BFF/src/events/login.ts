import axios from "axios";
import express from "express";

const routerLogin = express.Router();

routerLogin.post("/login", async (req, res) => {
  try {
    const authResponse = await axios.post(
      `${process.env.AUTH_URL}/auth/login`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //Get the jwt
    const jwt = authResponse.data.jwt;

    const profileResponse = await axios.get(
      `${process.env.PROFILE_URL}/profile/username`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    );

    res.status(200).json({ auth: jwt, profile: profileResponse.data });
  } catch (err: any) {
    const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
    const msg =
      err.code == "ECONNREFUSED"
        ? "Server unavailable"
        : err.response.data.error;
    res.status(status).json({ error: msg });
  }
});

export default routerLogin;
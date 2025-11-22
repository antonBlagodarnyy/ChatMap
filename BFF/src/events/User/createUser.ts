import axios from "axios";
import express from "express";

const routerCreateUser = express.Router();

routerCreateUser.post("/create", async (req, res) => {
  //Create the user
  try {
    const authResponse = await axios.post(
      `${process.env.AUTH_URL}/auth/signup`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //Get the jwt
    const jwt = authResponse.data.jwt;

    //try to create the profile for the user
    const profileResponse = await axios.post(
      `${process.env.PROFILE_URL}/profile/create`,
      {
        username: req.body.username,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    );

    //Return both responses combioned
    res.json({ auth: authResponse.data, profile: profileResponse.data });
  } catch (err: any) {
    //If it fails during profile creation, roll back the user
    if (err.config.url.includes("/profile/create")) {
      const jwt = err.config.headers.Authorization.split(" ")[1];
      try {
        await axios.post(
          `${process.env.AUTH_URL}/protected/delete`,
          {},
          { headers: { Authorization: "Bearer " + jwt } }
        );
      } catch (err: any) {
        console.log(
          "WARNING: Could not create profile and could not rollback" + err
        );
      }
    }

    //If failed user creation, return an error
    const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
    const msg =
      err.code == "ECONNREFUSED"
        ? "Server unavailable"
        : err.response.data.error;
    return res.status(status).json({ error: msg });
  }
});

export default routerCreateUser;

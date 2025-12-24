import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";

const routerNearbyLocation = express.Router({ mergeParams: true });

routerNearbyLocation.get("/nearbyNotCurrent/:lat/:lon/:radius", jwtCheck, async (req, res) => {
  const token = req.header("Authorization");

  if (token)
    
    try {
      const nearbyLocationResponse = await axios.get(
        `${process.env.LOCATION_URL}/location/nearbyNotCurrent`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          params: {
            lat: req.params.lat,
            lon: req.params.lon,
            radius: req.params.radius,
          },
        }
      );

      res.status(200).json({ locations: nearbyLocationResponse.data.locations });
    } catch (err: any) {
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

export default routerNearbyLocation;

import axios from "axios";
import express from "express";
import { jwtCheck } from "../../middleware/JwtCheck.js";
const routerCurrentLocation = express.Router();
routerCurrentLocation.get("/current", jwtCheck, async (req, res) => {
    const token = req.header("Authorization");
    if (token)
        try {
            const currentLocationResponse = await axios.get(`${process.env.LOCATION_URL}/location/current`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            res.status(200).json({ location: currentLocationResponse.data.location });
        }
        catch (err) {
            //If failed, return an error
            const status = err.code == "ECONNREFUSED" ? 503 : err.response.status;
            const msg = err.code == "ECONNREFUSED"
                ? "Server unavailable"
                : err.response.data.error;
            return res.status(status).json({ error: msg });
        }
    else
        res.status(401).json({ message: "no token" });
});
export default routerCurrentLocation;
//# sourceMappingURL=currentLocation.js.map
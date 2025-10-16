// Use "type: module" in package.json to use ES modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerCreateUser from "./events/User/createUser.js";
import routerLogin from "./events/User/login.js";
import routerCreateLocation from "./events/Location/createLocation.js";
import routerCurrentLocation from "./events/Location/currentLocation.js";
import routerNearbyLocation from "./events/Location/nearbyLocation.js";
import routerUserData from "./events/User/userData.js";

dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(
  "/location",
  routerCreateLocation,
  routerCurrentLocation,
  routerNearbyLocation
);
app.use("/user", routerCreateUser, routerLogin, routerUserData);

app.listen(port, () => {
  console.log(`Api Gateway listening on port: ${port}`);
});

// Export the Express app
export default app;

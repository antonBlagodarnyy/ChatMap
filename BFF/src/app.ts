// Use "type: module" in package.json to use ES modules
import express from "express";
import dotenv from "dotenv";
import routerCreateUser from "./events/createUser.js";
import routerLogin from "./events/login.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true,
  })
);

app.use("/user", routerCreateUser, routerLogin);

app.listen(port, () => {
  console.log(`Api Gateway listening on port: ${port}`);
});

// Export the Express app
export default app;

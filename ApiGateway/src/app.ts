// Use "type: module" in package.json to use ES modules
import express from "express";
import dotenv from "dotenv";
import { jwtCheck } from "./middleware/JwtCheck.js";

import routerAuth from "./routes/auth.js";

dotenv.config();

const app = express();
const port = 3000;

// Define your routes
app.post("/", jwtCheck, (req, res) => {
  res.json({ message: "end of the endpoint" });
});

app.use("/auth", routerAuth);

app.listen(port, () => {
  console.log(`Api Gateway listening on port: ${port}`);
});

app.use();
// Export the Express app
export default app;

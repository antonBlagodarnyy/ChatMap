
const express = require("express");
const proxy = require("express-http-proxy");

const routerAuth = express.router();

routerAuth.post("/signup", proxy(process.env.AUTH_URL + "/signup"));
routerAuth.post("/signin", proxy(process.env.AUTH_URL + "/signin"));

export default routerAuth;
